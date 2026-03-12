import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import App from './App'
import { generatedDashboardData } from './data/generatedDashboardData'
import { buildAlternative5Model } from './utils/alternative5Model'
import { formatCurrencyCompact } from './utils/format'

const ALT5_STORAGE_KEY = 'oxford-alternative-5-inputs'
const baseAlternative5 = generatedDashboardData.alternatives.find(
  (alternative) => alternative.id === 'alternative-5',
)

if (!baseAlternative5) {
  throw new Error('Alternative 5 test fixture is missing.')
}

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('renders the recommended model with live Alternative 5 controls', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /business alternatives dashboard/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/selected model/i)).toBeInTheDocument()
    expect(screen.getByText(/investor takeaway/i)).toBeInTheDocument()
    expect(
      screen.getByText(
        /Current modeled outcome: \$102\.8M of 10-year net cash flow, \$900K of peak drawdown, and year 5 payback\./i,
      ),
    ).toBeInTheDocument()
    expect(screen.getByText(/broker role/i)).toBeInTheDocument()
    expect(screen.getByText(/master plan \/ architecture \/ manifesto royalty/i)).toBeInTheDocument()
    expect(screen.getByText(/platform community fees/i)).toBeInTheDocument()
    expect(screen.getByText(/Workbook defaults active/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /download local copy/i }),
    ).toBeDisabled()
  })

  it('switches the alternative explorer content when a tab is selected', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Alternative 3' }))

    expect(
      screen.getByRole('heading', { name: 'Broker + Developer + Fractionals' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Maximum upside with the heaviest operating complexity/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/The biggest swing on paper/i)).toBeInTheDocument()
  })

  it('reorders the comparison table and updates the projection table for the active alternative', async () => {
    const user = userEvent.setup()
    render(<App />)

    const comparisonTable = screen.getByRole('table', {
      name: /comparison table/i,
    })

    let rows = within(comparisonTable).getAllByRole('row')
    expect(
      within(rows[1]).getByText(/Broker \+ Developer \+ Fractionals/i),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Capital required' }))

    rows = within(comparisonTable).getAllByRole('row')
    expect(
      within(rows[1]).getByText(/Broker \+ Royalty \+ Platform/i),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Alternative 2' }))

    const annualProjectionTable = screen.getByRole('table', {
      name: /annual projection table/i,
    })

    expect(within(annualProjectionTable).getByText(/\$186\.\dK/)).toBeInTheDocument()
    expect(screen.getAllByText('$79.3M').length).toBeGreaterThan(0)
  })

  it('updates Alternative 5 live and persists custom inputs locally', async () => {
    const user = userEvent.setup()
    const modeledAlternative5 = buildAlternative5Model(
      baseAlternative5,
      generatedDashboardData.modeling.alternative5,
      {
        ...generatedDashboardData.modeling.alternative5.defaultInputs,
        brokerEquityPct: 0.1,
      },
    ).alternative

    render(<App />)

    const brokerEquityInput = screen.getByRole('spinbutton', {
      name: /broker equity %/i,
    })

    await user.clear(brokerEquityInput)
    await user.type(brokerEquityInput, '10')

    await waitFor(() => {
      expect(screen.getByText(/Custom scenario active/i)).toBeInTheDocument()
    })

    expect(
      screen.getByText(
        new RegExp(
          `Custom input scenario: ${escapeForRegExp(
            formatCurrencyCompact(modeledAlternative5.tenYearNetCashFlow),
          )} of 10-year net cash flow`,
          'i',
        ),
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /download local copy/i }),
    ).toBeEnabled()

    await waitFor(() => {
      expect(
        JSON.parse(window.localStorage.getItem(ALT5_STORAGE_KEY) ?? '{}'),
      ).toMatchObject({
        brokerEquityPct: 0.1,
      })
    })
  })

  it('downloads a local Alternative 5 snapshot once inputs change', async () => {
    const user = userEvent.setup()
    const createObjectURL = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:oxford-test')
    const revokeObjectURL = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => undefined)
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined)
    const modeledAlternative5 = buildAlternative5Model(
      baseAlternative5,
      generatedDashboardData.modeling.alternative5,
      {
        ...generatedDashboardData.modeling.alternative5.defaultInputs,
        brokerEquityPct: 0.1,
      },
    ).alternative

    render(<App />)

    const brokerEquityInput = screen.getByRole('spinbutton', {
      name: /broker equity %/i,
    })

    await user.clear(brokerEquityInput)
    await user.type(brokerEquityInput, '10')
    await user.click(screen.getByRole('button', { name: /download local copy/i }))

    expect(createObjectURL).toHaveBeenCalledTimes(1)
    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:oxford-test')

    const blob = createObjectURL.mock.calls[0][0] as Blob
    const snapshot = JSON.parse(await blob.text())

    expect(snapshot.sourceWorkbook).toBe(generatedDashboardData.source.workbook)
    expect(snapshot.inputs).toMatchObject({ brokerEquityPct: 0.1 })
    expect(snapshot.summary.tenYearNetCashFlow).toBe(
      modeledAlternative5.tenYearNetCashFlow,
    )
  })
})

function escapeForRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
