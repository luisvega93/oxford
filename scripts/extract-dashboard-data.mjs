import fs from 'node:fs/promises'
import path from 'node:path'
import xlsx from 'xlsx'

const workbookPath = await resolveWorkbookPath(process.cwd())
const outputPath = path.resolve(
  process.cwd(),
  'src',
  'data',
  'generatedDashboardData.ts',
)

const usedScenarioCodes = new Set(['a', 'b', 'c', 'e', 'g', 'h'])

const workbook = xlsx.readFile(workbookPath)
const alternativesSheet = workbook.Sheets['Business Alternatives']
const scenariosSheet = workbook.Sheets.Scenarios
const resultsSheet = workbook.Sheets.Results_10yr

if (!alternativesSheet || !scenariosSheet || !resultsSheet) {
  throw new Error(
    'Expected "Business Alternatives", "Scenarios", and "Results_10yr" worksheets to exist.',
  )
}

const alternativeRows = xlsx.utils.sheet_to_json(alternativesSheet, {
  header: 1,
  raw: true,
  defval: null,
})

const scenarioRows = xlsx.utils
  .sheet_to_json(scenariosSheet, { header: 1, raw: false, defval: '' })
  .map((row) => cleanText(row[0]))

const resultsRows = xlsx.utils.sheet_to_json(resultsSheet, {
  header: 1,
  raw: true,
  defval: null,
})

const summaryHeaderIndex = alternativeRows.findIndex(
  (row) => row[0] === 'Alternative' && row[1] === 'Included scenarios',
)

if (summaryHeaderIndex === -1) {
  throw new Error('Could not locate the summary table in Business Alternatives.')
}

const summaryRows = alternativeRows.slice(summaryHeaderIndex + 1, summaryHeaderIndex + 6)

const alternatives = summaryRows.map((row, index) => {
  const order = index + 1
  const id = `alternative-${order}`
  const rawLabel = cleanText(row[0])
  const name = rawLabel.replace(/^\d+\)\s*/, '')
  const projections = extractProjectionBlock(alternativeRows, order)
  const tenYearRevenue = asMoney(row[3])
  const tenYearCosts = asMoney(row[4])
  const tenYearNetCashFlow = asMoney(row[5])
  const capitalRequirement = asMoney(row[6])

  return {
    id,
    order,
    name,
    displayName: rawLabel,
    shortLabel: `Alternative ${order}`,
    thesis: cleanText(row[2]),
    includedScenarioCodes: cleanText(row[1])
      .split('+')
      .map((entry) => cleanText(entry))
      .filter(Boolean),
    includedScenarioLabel: cleanText(row[1]),
    tenYearRevenue,
    tenYearCosts,
    tenYearNetCashFlow,
    capitalRequirement,
    peakDrawdownAbs: Math.abs(Math.min(capitalRequirement, 0)),
    payback: cleanText(row[7]),
    netMargin: tenYearRevenue === 0 ? 0 : tenYearNetCashFlow / tenYearRevenue,
    recommended: order === 5,
    projections,
  }
})

const alternative5 = alternatives.find((alternative) => alternative.id === 'alternative-5')

if (!alternative5) {
  throw new Error('Could not locate Alternative 5 in Business Alternatives.')
}

const brokerProjection = extractScenarioProjection(
  resultsRows,
  'a) Broker (equity stake)',
)
const royaltyProjection = extractScenarioProjection(
  resultsRows,
  'c) Royalty (future projects)',
)
const platformProjection = derivePlatformProjection(
  alternative5.projections,
  brokerProjection,
  royaltyProjection,
)

const scenarioDefinitions = extractScenarioDefinitions(scenarioRows)

const generatedDashboardData = {
  source: {
    workbook: path.basename(workbookPath),
    generatedAt: new Date().toISOString(),
  },
  scenarios: scenarioDefinitions,
  alternatives,
  modeling: {
    alternative5: {
      defaultInputs: {
        brokerEquityPct: asNumber(
          findControlValue(resultsRows, 'Equity stake %'),
        ),
        brokerAdminCostPct: asNumber(
          findControlValue(resultsRows, 'Broker admin expense % of broker revenue'),
        ),
        royaltyRatePct: asNumber(
          findControlValue(resultsRows, 'Royalty % on gross unit sales'),
        ),
        royaltyAdminCostPct: asNumber(
          findControlValue(resultsRows, 'Royalty admin expense % of royalty revenue'),
        ),
        platformAnnualFee: asMoney(
          findControlValue(resultsRows, 'Annual community fee / unit'),
        ),
        platformNetMarginPct: asNumber(
          findControlValue(resultsRows, 'Net margin'),
        ),
      },
      brokerPreSalesOverheadAnnual: asMoney(
        findControlValue(resultsRows, 'Broker pre-sales overhead (annual)'),
      ),
      components: {
        broker: brokerProjection,
        royalty: royaltyProjection,
        platform: platformProjection,
      },
    },
  },
}

const fileContents = `import type { DashboardData } from '../types/dashboard'

export const generatedDashboardData: DashboardData = ${JSON.stringify(
  generatedDashboardData,
  null,
  2,
)}
`

await fs.writeFile(outputPath, fileContents)

function cleanText(value) {
  if (value === null || value === undefined) {
    return ''
  }

  return normalizeWorkbookText(String(value)).replace(/\s+/g, ' ').trim()
}

function asMoney(value) {
  if (typeof value === 'number') {
    return Math.round(value)
  }

  const numeric = Number(String(value).replace(/[$,]/g, ''))
  return Number.isFinite(numeric) ? Math.round(numeric) : 0
}

function asNumber(value) {
  if (typeof value === 'number') {
    return value
  }

  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : 0
}

function extractProjectionBlock(rows, order) {
  const marker = `Alternative ${order}`

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < rows[rowIndex].length; columnIndex += 1) {
      const value = cleanText(rows[rowIndex][columnIndex])

      if (!value.startsWith(marker)) {
        continue
      }

      return readProjectionRows(rows, rowIndex + 2, columnIndex)
    }
  }

  throw new Error(`Could not find projection block for ${marker}.`)
}

function readProjectionRows(rows, startRow, startColumn) {
  const projections = []

  for (let rowIndex = startRow; rowIndex < rows.length; rowIndex += 1) {
    const yearCell = rows[rowIndex][startColumn]
    const label = cleanText(yearCell)

    if (!label) {
      continue
    }

    if (label === '10-Year Total') {
      break
    }

    projections.push({
      year: Number(yearCell),
      revenue: asMoney(rows[rowIndex][startColumn + 1]),
      costs: asMoney(rows[rowIndex][startColumn + 2]),
      netCashFlow: asMoney(rows[rowIndex][startColumn + 3]),
      cumulativeCashFlow: asMoney(rows[rowIndex][startColumn + 4]),
    })
  }

  return projections
}

function extractScenarioProjection(rows, scenarioLabel) {
  const titlesRowIndex = rows.findIndex(
    (row, index) =>
      row.includes(scenarioLabel) &&
      cleanText(rows[index + 1]?.[0]) === 'Year',
  )

  if (titlesRowIndex === -1) {
    throw new Error(`Could not find a scenario table for ${scenarioLabel}.`)
  }

  const titlesRow = rows[titlesRowIndex]
  const scenarioColumnIndex = titlesRow.indexOf(scenarioLabel)

  if (scenarioColumnIndex === -1) {
    throw new Error(`Could not resolve the scenario column for ${scenarioLabel}.`)
  }

  const projections = []

  for (let rowIndex = titlesRowIndex + 2; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex]
    const yearCell = row?.[0]
    const label = cleanText(yearCell)

    if (!label) {
      continue
    }

    if (label === '10-Year Total' || label === '10-yr total') {
      break
    }

    projections.push({
      year: Number(yearCell),
      revenue: asMoney(row[scenarioColumnIndex]),
      costs: asMoney(row[scenarioColumnIndex + 1]),
      netCashFlow: asMoney(row[scenarioColumnIndex + 2]),
      cumulativeCashFlow: asMoney(row[scenarioColumnIndex + 3]),
    })
  }

  return projections
}

function derivePlatformProjection(alternativeProjection, brokerProjection, royaltyProjection) {
  return alternativeProjection.map((projection, index) => {
    const broker = brokerProjection[index]
    const royalty = royaltyProjection[index]

    return {
      year: projection.year,
      revenue: asMoney(projection.revenue - broker.revenue - royalty.revenue),
      costs: asMoney(projection.costs - broker.costs - royalty.costs),
      netCashFlow: asMoney(
        projection.netCashFlow - broker.netCashFlow - royalty.netCashFlow,
      ),
      cumulativeCashFlow: 0,
    }
  })
}

function findControlValue(rows, label) {
  for (const row of rows) {
    const columnIndex = row.findIndex((cell) => cleanText(cell) === label)

    if (columnIndex !== -1) {
      return row[columnIndex + 1]
    }
  }

  throw new Error(`Could not find control value for "${label}".`)
}

function extractScenarioDefinitions(rows) {
  const definitions = {}
  let current = null

  for (const row of rows) {
    const match = row.match(/^([a-h])\)\s+(.+)$/)

    if (match) {
      if (current && usedScenarioCodes.has(current.code)) {
        definitions[current.code] = buildScenarioDefinition(current)
      }

      current = {
        code: match[1],
        title: match[2],
        lines: [],
      }

      continue
    }

    if (!current || !row) {
      continue
    }

    current.lines.push(row)
  }

  if (current && usedScenarioCodes.has(current.code)) {
    definitions[current.code] = buildScenarioDefinition(current)
  }

  return definitions
}

function buildScenarioDefinition(block) {
  const howMoneyIndex = block.lines.findIndex((line) =>
    line.startsWith('How money shows up'),
  )
  const keyThingIndex = block.lines.indexOf('Key thing to know:')

  return {
    code: block.code,
    title: block.title,
    summary: block.lines[0] ?? '',
    cashFlowLines:
      howMoneyIndex === -1
        ? []
        : block.lines
            .slice(howMoneyIndex + 1, keyThingIndex === -1 ? undefined : keyThingIndex)
            .filter(Boolean),
    keyTakeaway:
      keyThingIndex === -1 ? '' : cleanText(block.lines[keyThingIndex + 1]),
  }
}

function normalizeWorkbookText(value) {
  const repaired = /[ÃƒÃ¢]/.test(value)
    ? Buffer.from(value, 'latin1').toString('utf8')
    : value

  return repaired
    .replaceAll('â†’', '->')
    .replaceAll('Ã—', 'x')
    .replaceAll('Ã·', '/')
}

async function resolveWorkbookPath(cwd) {
  const files = await fs.readdir(cwd)
  const versionedWorkbooks = files
    .map((fileName) => {
      const match = fileName.match(/^The Commons Model v(\d+)\.xlsx$/i)

      if (!match) {
        return null
      }

      return {
        fileName,
        version: Number(match[1]),
      }
    })
    .filter(Boolean)
    .sort((left, right) => right.version - left.version)

  if (!versionedWorkbooks.length) {
    throw new Error('Could not find a workbook matching "The Commons Model v*.xlsx".')
  }

  return path.resolve(cwd, versionedWorkbooks[0].fileName)
}
