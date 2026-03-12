import { startTransition, useDeferredValue, useEffect, useState } from 'react'

import { Alternative5Controls } from './components/Alternative5Controls'
import { ComparisonChart } from './components/ComparisonChart'
import { MetricCard } from './components/MetricCard'
import { ProjectionChart } from './components/ProjectionChart'
import { ScenarioBadge } from './components/ScenarioBadge'
import { SectionHeading } from './components/SectionHeading'
import { editorialContent } from './data/editorialContent'
import { generatedDashboardData } from './data/generatedDashboardData'
import type { Alternative, Alternative5Inputs } from './types/dashboard'
import {
  areAlternative5InputsEqual,
  buildAlternative5LocalCopy,
  buildAlternative5Model,
  sanitizeAlternative5Inputs,
} from './utils/alternative5Model'
import {
  formatCurrencyCompact,
  formatDrawdown,
  formatGeneratedDate,
  formatPercent,
  paybackRank,
} from './utils/format'

type SortMetric = 'tenYearNetCashFlow' | 'peakDrawdownAbs' | 'netMargin' | 'payback'

const ALTERNATIVE_5_ID = 'alternative-5'
const ALT5_STORAGE_KEY = 'oxford-alternative-5-inputs'

const baseAlternative5 =
  generatedDashboardData.alternatives.find(
    (alternative) => alternative.id === ALTERNATIVE_5_ID,
  ) ?? generatedDashboardData.alternatives[0]

const alternative5Defaults = generatedDashboardData.modeling.alternative5.defaultInputs

const sortOptions: Array<{
  value: SortMetric
  label: string
}> = [
  { value: 'tenYearNetCashFlow', label: 'Net cash flow' },
  { value: 'peakDrawdownAbs', label: 'Capital required' },
  { value: 'netMargin', label: 'Net margin' },
  { value: 'payback', label: 'Payback' },
]

function App() {
  const [selectedAlternativeId, setSelectedAlternativeId] =
    useState(ALTERNATIVE_5_ID)
  const [sortMetric, setSortMetric] = useState<SortMetric>('tenYearNetCashFlow')
  const [alternative5Inputs, setAlternative5Inputs] = useState(() =>
    loadAlternative5Inputs(alternative5Defaults),
  )

  useEffect(() => {
    persistAlternative5Inputs(alternative5Inputs, alternative5Defaults)
  }, [alternative5Inputs])

  const modeledAlternative5 = buildAlternative5Model(
    baseAlternative5,
    generatedDashboardData.modeling.alternative5,
    alternative5Inputs,
  )
  const alternatives = generatedDashboardData.alternatives.map((alternative) =>
    alternative.id === ALTERNATIVE_5_ID ? modeledAlternative5.alternative : alternative,
  )
  const recommendedAlternative =
    alternatives.find((alternative) => alternative.id === ALTERNATIVE_5_ID) ??
    alternatives[0]
  const deferredAlternativeId = useDeferredValue(selectedAlternativeId)
  const selectedAlternative =
    alternatives.find((alternative) => alternative.id === deferredAlternativeId) ??
    recommendedAlternative
  const selectedEditorial =
    editorialContent.alternatives[selectedAlternative.id] ??
    editorialContent.alternatives[recommendedAlternative.id]
  const sortedAlternatives = [...alternatives].sort((left, right) =>
    sortAlternatives(left, right, sortMetric),
  )
  const hasCustomAlternative5Inputs = !areAlternative5InputsEqual(
    alternative5Inputs,
    alternative5Defaults,
  )

  return (
    <div className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top_left,rgba(210,166,78,0.24),transparent_40%),radial-gradient(circle_at_top_right,rgba(19,49,44,0.18),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0))]" />

      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-12 px-4 py-6 sm:px-6 lg:px-8">
        <header className="panel flex flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--color-accent)]">
              The Commons
            </p>
            <h1 className="mt-2 font-display text-3xl text-[var(--color-ink)] sm:text-4xl">
              Business alternatives dashboard
            </h1>
          </div>
          <nav className="flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
            <a href="#overview" className="nav-link">
              Overview
            </a>
            <a href="#comparison" className="nav-link">
              Comparison
            </a>
            <a href="#explorer" className="nav-link">
              Alternative explorer
            </a>
            <a href="#projections" className="nav-link">
              Projections
            </a>
          </nav>
        </header>

        <section
          id="overview"
          className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]"
          aria-labelledby="overview-heading"
        >
          <div className="panel px-7 py-8 sm:px-10 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--color-accent)]">
              {editorialContent.hero.eyebrow}
            </p>
            <h2
              id="overview-heading"
              className="mt-5 max-w-3xl font-display text-5xl leading-none text-[var(--color-ink)] sm:text-6xl"
            >
              {editorialContent.hero.headline}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {editorialContent.hero.summary}
            </p>
            <div className="mt-8 rounded-[2rem] border border-amber-200/70 bg-[linear-gradient(135deg,rgba(255,249,238,0.92),rgba(210,166,78,0.14))] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
                Investor takeaway
              </p>
              <p className="mt-3 text-lg font-semibold leading-8 text-[var(--color-ink)]">
                {buildAlternative5Callout(
                  recommendedAlternative,
                  hasCustomAlternative5Inputs,
                )}
              </p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                {editorialContent.alternatives[ALTERNATIVE_5_ID].investorAngle}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <MetricCard
              label="10-year revenue"
              value={formatCurrencyCompact(recommendedAlternative.tenYearRevenue)}
            />
            <MetricCard
              label="10-year net cash flow"
              value={formatCurrencyCompact(recommendedAlternative.tenYearNetCashFlow)}
              accent
            />
            <MetricCard
              label="Net margin"
              value={formatPercent(recommendedAlternative.netMargin)}
            />
            <MetricCard
              label="Capital required"
              value={formatDrawdown(recommendedAlternative.peakDrawdownAbs)}
            />
          </div>
        </section>

        <section id="comparison" className="space-y-8" aria-labelledby="comparison-heading">
          <SectionHeading
            eyebrow="Compare the set"
            title="See the trade-off between upside and capital intensity."
            description={editorialContent.comparisonIntro}
          />

          <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
            <ComparisonChart
              alternatives={alternatives}
              selectedAlternativeId={selectedAlternative.id}
            />

            <div className="panel overflow-hidden">
              <div className="border-b border-[var(--color-border)] px-6 py-5">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
                  Sort the comparison
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        sortMetric === option.value
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                          : 'border-[var(--color-border)] bg-white text-slate-600'
                      }`}
                      onClick={() => {
                        startTransition(() => setSortMetric(option.value))
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table aria-label="Comparison table" className="min-w-full text-left">
                  <thead className="bg-[rgba(22,49,45,0.04)] text-xs uppercase tracking-[0.24em] text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Alternative</th>
                      <th className="px-6 py-4">Net cash flow</th>
                      <th className="px-6 py-4">Capital required</th>
                      <th className="px-6 py-4">Net margin</th>
                      <th className="px-6 py-4">Payback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAlternatives.map((alternative) => (
                      <tr
                        key={alternative.id}
                        className={`cursor-pointer border-t border-[var(--color-border)] transition hover:bg-[rgba(22,49,45,0.04)] ${
                          alternative.id === selectedAlternative.id
                            ? 'bg-[rgba(210,166,78,0.12)]'
                            : ''
                        }`}
                        onClick={() => {
                          startTransition(() => setSelectedAlternativeId(alternative.id))
                        }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-ink)] text-sm font-semibold text-white">
                              {alternative.order}
                            </span>
                            <div>
                              <p className="font-semibold text-[var(--color-ink)]">
                                {alternative.name}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {alternative.recommended
                                  ? 'Recommended model'
                                  : 'Alternative path'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-[var(--color-ink)]">
                          {formatCurrencyCompact(alternative.tenYearNetCashFlow)}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {formatDrawdown(alternative.peakDrawdownAbs)}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {formatPercent(alternative.netMargin)}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {alternative.payback}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section id="explorer" className="space-y-8" aria-labelledby="explorer-heading">
          <SectionHeading
            eyebrow="Alternative explorer"
            title="Understand the business model behind each option."
            description="Use the tabs to review the thesis, component scenarios, curated pros and cons, the investor narrative, and live parameters for Alternative 5."
          />

          <div className="panel px-6 py-6 sm:px-8">
            <div className="flex flex-wrap gap-3">
              {alternatives.map((alternative) => (
                <button
                  key={alternative.id}
                  type="button"
                  aria-pressed={alternative.id === selectedAlternative.id}
                  className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${
                    alternative.id === selectedAlternative.id
                      ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white'
                      : 'border-[var(--color-border)] bg-white text-slate-600'
                  }`}
                  onClick={() => {
                    startTransition(() => setSelectedAlternativeId(alternative.id))
                  }}
                >
                  {alternative.shortLabel}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.95fr]">
              <article className="rounded-[2rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.72))] p-6 shadow-[0_20px_60px_rgba(19,49,44,0.08)] sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
                      {selectedAlternative.shortLabel}
                    </p>
                    <h3 className="mt-3 font-display text-4xl leading-none text-[var(--color-ink)]">
                      {selectedAlternative.name}
                    </h3>
                  </div>
                  <div className="rounded-full border border-amber-200/70 bg-amber-50 px-4 py-2 text-sm font-semibold text-[var(--color-accent-strong)]">
                    {selectedEditorial.tagline}
                  </div>
                </div>

                <p className="mt-6 text-base leading-7 text-slate-600">
                  {selectedEditorial.explanation}
                </p>

                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                      Pros
                    </p>
                    <ul className="mt-4 space-y-3">
                      {selectedEditorial.pros.map((item) => (
                        <li
                          key={item}
                          className="rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-slate-600 shadow-[0_14px_32px_rgba(19,49,44,0.04)]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                      Cons
                    </p>
                    <ul className="mt-4 space-y-3">
                      {selectedEditorial.cons.map((item) => (
                        <li
                          key={item}
                          className="rounded-2xl bg-[rgba(163,77,45,0.08)] px-4 py-3 text-sm leading-6 text-slate-600"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 rounded-[1.75rem] border border-[var(--color-border)] bg-[rgba(22,49,45,0.06)] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                    Investor angle
                  </p>
                  <p className="mt-3 text-base leading-7 text-[var(--color-ink)]">
                    {selectedEditorial.investorAngle}
                  </p>
                </div>
              </article>

              <aside className="space-y-6">
                <div className="panel p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                    Business model thesis
                  </p>
                  <p className="mt-4 text-lg leading-8 text-[var(--color-ink)]">
                    {selectedAlternative.thesis}
                  </p>
                </div>

                <div className="panel p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                    Included scenarios
                  </p>
                  <div className="mt-4 grid gap-3">
                    {selectedAlternative.includedScenarioCodes.map((scenarioCode) => (
                      <ScenarioBadge
                        key={scenarioCode}
                        scenario={generatedDashboardData.scenarios[scenarioCode]}
                      />
                    ))}
                  </div>
                </div>

                {selectedAlternative.id === ALTERNATIVE_5_ID ? (
                  <Alternative5Controls
                    inputs={alternative5Inputs}
                    defaults={alternative5Defaults}
                    hasCustomInputs={hasCustomAlternative5Inputs}
                    onPercentChange={(field, value) => {
                      setAlternative5Inputs((current) =>
                        sanitizeAlternative5Inputs({
                          ...current,
                          [field]: value,
                        }),
                      )
                    }}
                    onCurrencyChange={(field, value) => {
                      setAlternative5Inputs((current) =>
                        sanitizeAlternative5Inputs({
                          ...current,
                          [field]: value,
                        }),
                      )
                    }}
                    onReset={() => {
                      setAlternative5Inputs(alternative5Defaults)
                    }}
                    onDownload={() => {
                      if (!hasCustomAlternative5Inputs) {
                        return
                      }

                      downloadAlternative5LocalCopy(
                        buildAlternative5LocalCopy(
                          generatedDashboardData.source.workbook,
                          modeledAlternative5.alternative,
                          modeledAlternative5.components,
                          modeledAlternative5.inputs,
                        ),
                      )
                    }}
                  />
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <MetricCard
                    label="10-year revenue"
                    value={formatCurrencyCompact(selectedAlternative.tenYearRevenue)}
                  />
                  <MetricCard
                    label="10-year costs"
                    value={formatCurrencyCompact(selectedAlternative.tenYearCosts)}
                  />
                  <MetricCard
                    label="10-year net cash flow"
                    value={formatCurrencyCompact(
                      selectedAlternative.tenYearNetCashFlow,
                    )}
                    accent
                  />
                  <MetricCard label="Payback" value={selectedAlternative.payback} />
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="projections" className="space-y-8" aria-labelledby="projections-heading">
          <SectionHeading
            eyebrow="Financial projections"
            title="Read the 10-year profile for the selected alternative."
            description="The chart and tables below update with the currently selected option so users can compare the timing of revenue, costs, net cash flow, and cumulative cash generation."
          />

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.85fr]">
            <ProjectionChart alternative={selectedAlternative} />

            <div className="space-y-6">
              <div className="panel p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                  10-year totals
                </p>
                <dl className="mt-5 space-y-4 text-sm">
                  <DataRow
                    label="Revenue"
                    value={formatCurrencyCompact(selectedAlternative.tenYearRevenue)}
                  />
                  <DataRow
                    label="Costs"
                    value={formatCurrencyCompact(selectedAlternative.tenYearCosts)}
                  />
                  <DataRow
                    label="Net cash flow"
                    value={formatCurrencyCompact(
                      selectedAlternative.tenYearNetCashFlow,
                    )}
                    accent
                  />
                  <DataRow
                    label="Capital required"
                    value={formatDrawdown(selectedAlternative.peakDrawdownAbs)}
                  />
                  <DataRow label="Payback" value={selectedAlternative.payback} />
                </dl>
              </div>

              <div className="panel overflow-hidden">
                <div className="border-b border-[var(--color-border)] px-6 py-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                    Annual projection table
                  </p>
                </div>
                <div className="max-h-[24rem] overflow-auto">
                  <table
                    aria-label="Annual projection table"
                    className="min-w-full text-left text-sm"
                  >
                    <thead className="sticky top-0 bg-[rgba(248,243,232,0.96)] text-xs uppercase tracking-[0.24em] text-slate-500">
                      <tr>
                        <th className="px-6 py-4">Year</th>
                        <th className="px-6 py-4">Revenue</th>
                        <th className="px-6 py-4">Costs</th>
                        <th className="px-6 py-4">Net CF</th>
                        <th className="px-6 py-4">Cumulative</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedAlternative.projections.map((projection) => (
                        <tr
                          key={projection.year}
                          className="border-t border-[var(--color-border)] text-slate-600"
                        >
                          <td className="px-6 py-4 font-semibold text-[var(--color-ink)]">
                            {projection.year}
                          </td>
                          <td className="px-6 py-4">
                            {formatCurrencyCompact(projection.revenue)}
                          </td>
                          <td className="px-6 py-4">
                            {formatCurrencyCompact(projection.costs)}
                          </td>
                          <td className="px-6 py-4">
                            {formatCurrencyCompact(projection.netCashFlow)}
                          </td>
                          <td className="px-6 py-4">
                            {formatCurrencyCompact(projection.cumulativeCashFlow)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="panel px-6 py-6 text-sm leading-7 text-slate-600">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
            {editorialContent.footerTitle}
          </p>
          <p className="mt-3">{editorialContent.methodologyNote}</p>
          <p className="mt-3">
            Source workbook: {generatedDashboardData.source.workbook}. Data generated{' '}
            {formatGeneratedDate(generatedDashboardData.source.generatedAt)}.
          </p>
          {hasCustomAlternative5Inputs ? (
            <p className="mt-3">
              Custom Alternative 5 inputs are currently active and stored locally
              in this browser.
            </p>
          ) : null}
        </footer>
      </main>
    </div>
  )
}

interface DataRowProps {
  label: string
  value: string
  accent?: boolean
}

function DataRow({ label, value, accent = false }: DataRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/80 px-4 py-3">
      <dt className="text-slate-500">{label}</dt>
      <dd
        className={`text-right font-semibold ${
          accent ? 'text-[var(--color-accent-strong)]' : 'text-[var(--color-ink)]'
        }`}
      >
        {value}
      </dd>
    </div>
  )
}

function sortAlternatives(left: Alternative, right: Alternative, sortMetric: SortMetric) {
  switch (sortMetric) {
    case 'peakDrawdownAbs':
      return left.peakDrawdownAbs - right.peakDrawdownAbs
    case 'netMargin':
      return right.netMargin - left.netMargin
    case 'payback':
      return paybackRank(left.payback) - paybackRank(right.payback)
    case 'tenYearNetCashFlow':
    default:
      return right.tenYearNetCashFlow - left.tenYearNetCashFlow
  }
}

function buildAlternative5Callout(
  alternative: Alternative,
  hasCustomInputs: boolean,
) {
  const intro = hasCustomInputs ? 'Custom input scenario' : 'Current modeled outcome'
  const payback =
    alternative.payback.toLowerCase().includes('cash-positive')
      ? alternative.payback.toLowerCase()
      : `${alternative.payback.toLowerCase()} payback`

  return `${intro}: ${formatCurrencyCompact(
    alternative.tenYearNetCashFlow,
  )} of 10-year net cash flow, ${formatDrawdown(
    alternative.peakDrawdownAbs,
  )} of peak drawdown, and ${payback}.`
}

function loadAlternative5Inputs(defaults: Alternative5Inputs) {
  if (typeof window === 'undefined') {
    return defaults
  }

  try {
    const stored = window.localStorage.getItem(ALT5_STORAGE_KEY)

    if (!stored) {
      return defaults
    }

    const parsed = JSON.parse(stored) as Partial<Alternative5Inputs>
    return sanitizeAlternative5Inputs({
      ...defaults,
      ...parsed,
    })
  } catch {
    return defaults
  }
}

function persistAlternative5Inputs(
  inputs: Alternative5Inputs,
  defaults: Alternative5Inputs,
) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    if (areAlternative5InputsEqual(inputs, defaults)) {
      window.localStorage.removeItem(ALT5_STORAGE_KEY)
      return
    }

    window.localStorage.setItem(ALT5_STORAGE_KEY, JSON.stringify(inputs))
  } catch {
    // Ignore local persistence failures so modeling still works.
  }
}

function downloadAlternative5LocalCopy(snapshot: unknown) {
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
    type: 'application/json',
  })
  const fileName = `oxford-alternative-5-${new Date()
    .toISOString()
    .replaceAll(':', '-')
    .replaceAll('.', '-')}.json`
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

export default App
