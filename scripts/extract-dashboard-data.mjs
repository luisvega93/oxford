import fs from 'node:fs/promises'
import path from 'node:path'
import xlsx from 'xlsx'

const workbookPath = path.resolve(process.cwd(), 'The Commons Model v3.xlsx')
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

if (!alternativesSheet || !scenariosSheet) {
  throw new Error(
    'Expected both "Business Alternatives" and "Scenarios" worksheets to exist.',
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

const scenarioDefinitions = extractScenarioDefinitions(scenarioRows)

const generatedDashboardData = {
  source: {
    workbook: path.basename(workbookPath),
    generatedAt: new Date().toISOString(),
  },
  scenarios: scenarioDefinitions,
  alternatives,
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
  const repaired = /[Ãâ]/.test(value)
    ? Buffer.from(value, 'latin1').toString('utf8')
    : value

  return repaired
    .replaceAll('→', '->')
    .replaceAll('×', 'x')
    .replaceAll('÷', '/')
}
