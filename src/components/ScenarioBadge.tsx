import type { ScenarioDefinition } from '../types/dashboard'
import { repairText } from '../utils/format'

interface ScenarioBadgeProps {
  scenario: ScenarioDefinition
}

function shortTitle(title: string) {
  return repairText(title).split('(')[0].trim()
}

export function ScenarioBadge({ scenario }: ScenarioBadgeProps) {
  const title = shortTitle(scenario.title)
  const summary = repairText(scenario.summary)
  const keyTakeaway = repairText(scenario.keyTakeaway)
  const cashFlowPreview = scenario.cashFlowLines
    .slice(0, 2)
    .map((line) => repairText(line))

  return (
    <article className="rounded-[1.5rem] border border-[var(--color-border)] bg-white px-4 py-4 shadow-[0_14px_40px_rgba(19,49,44,0.06)]">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-sm font-bold uppercase tracking-[0.16em] text-white">
          {scenario.code}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.04em] text-[var(--color-ink)]">
              {title}
            </p>
            <span className="rounded-full bg-[rgba(22,49,45,0.06)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Scenario {scenario.code.toUpperCase()}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-600">{summary}</p>

          {cashFlowPreview.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {cashFlowPreview.map((line) => (
                <li
                  key={line}
                  className="rounded-2xl bg-[rgba(210,166,78,0.12)] px-3 py-2 text-xs leading-5 text-[var(--color-accent-strong)]"
                >
                  {line}
                </li>
              ))}
            </ul>
          ) : null}

          {keyTakeaway ? (
            <p className="mt-3 rounded-2xl bg-[rgba(248,243,232,0.9)] px-3 py-3 text-sm leading-6 text-slate-600">
              {keyTakeaway}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  )
}
