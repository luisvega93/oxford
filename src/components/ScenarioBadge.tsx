import type { ScenarioDefinition } from '../types/dashboard'
import { repairText } from '../utils/format'

interface ScenarioBadgeProps {
  scenario: ScenarioDefinition
}

function shortTitle(title: string) {
  return repairText(title).split('(')[0].trim()
}

export function ScenarioBadge({ scenario }: ScenarioBadgeProps) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-left shadow-[0_14px_40px_rgba(19,49,44,0.06)] transition-transform duration-200 hover:-translate-y-0.5"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-ink)] text-sm font-bold uppercase tracking-[0.16em] text-white">
          {scenario.code}
        </span>
        <span className="text-sm font-semibold text-[var(--color-ink)]">
          {shortTitle(scenario.title)}
        </span>
      </button>

      <div className="pointer-events-none absolute left-0 top-[calc(100%+0.75rem)] z-20 w-[min(24rem,calc(100vw-3rem))] rounded-3xl border border-[var(--color-border)] bg-[rgba(248,243,232,0.98)] p-5 text-sm text-slate-700 opacity-0 shadow-[0_30px_80px_rgba(19,49,44,0.14)] transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
          Scenario {scenario.code.toUpperCase()}
        </p>
        <p className="mt-3 font-semibold text-[var(--color-ink)]">
          {repairText(scenario.title)}
        </p>
        <p className="mt-3 leading-6">{repairText(scenario.summary)}</p>
        {scenario.cashFlowLines.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {scenario.cashFlowLines.slice(0, 3).map((line) => (
              <li key={line} className="rounded-2xl bg-white/80 px-3 py-2 leading-5">
                {repairText(line)}
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-3 rounded-2xl border border-white/70 bg-white/70 px-3 py-3 leading-5 text-slate-600">
          {repairText(scenario.keyTakeaway)}
        </p>
      </div>
    </div>
  )
}
