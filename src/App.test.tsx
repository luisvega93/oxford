import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('renders the recommended model with the investor takeaway and KPIs', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /business alternatives dashboard/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/selected model/i)).toBeInTheDocument()
    expect(
      screen.getByText(/most capital-efficient option in the current model/i),
    ).toBeInTheDocument()
    expect(screen.getAllByText('$102.8M').length).toBeGreaterThan(0)
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
})
