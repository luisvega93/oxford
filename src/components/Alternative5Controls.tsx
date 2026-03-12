import type { Alternative5Inputs } from '../types/dashboard'

interface Alternative5ControlsProps {
  inputs: Alternative5Inputs
  defaults: Alternative5Inputs
  hasCustomInputs: boolean
  onPercentChange: (field: PercentField, value: number) => void
  onCurrencyChange: (field: CurrencyField, value: number) => void
  onReset: () => void
  onDownload: () => void
}

type PercentField =
  | 'brokerEquityPct'
  | 'brokerAdminCostPct'
  | 'royaltyRatePct'
  | 'royaltyAdminCostPct'
  | 'platformNetMarginPct'

type CurrencyField = 'platformAnnualFee'

const percentFields: Array<{
  field: PercentField
  label: string
  helper: string
}> = [
  {
    field: 'brokerEquityPct',
    label: 'Broker equity %',
    helper: 'Default 5%. Scales broker cash receipts.',
  },
  {
    field: 'brokerAdminCostPct',
    label: 'Broker admin cost %',
    helper: 'Applied to broker revenue after broker sales begin.',
  },
  {
    field: 'royaltyRatePct',
    label: 'Royalty %',
    helper: 'Applied to activated royalty revenue.',
  },
  {
    field: 'royaltyAdminCostPct',
    label: 'Royalty admin cost %',
    helper: 'Applied to royalty revenue after activation.',
  },
  {
    field: 'platformNetMarginPct',
    label: 'Platform net margin %',
    helper: 'Costs flex automatically to preserve this margin.',
  },
]

export function Alternative5Controls({
  inputs,
  defaults,
  hasCustomInputs,
  onPercentChange,
  onCurrencyChange,
  onReset,
  onDownload,
}: Alternative5ControlsProps) {
  return (
    <div className="panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            Alternative 5 inputs
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Changes update Alternative 5 live across the hero, comparison, and
            projections sections. Custom values are stored locally in this browser
            and can be downloaded as a JSON snapshot.
          </p>
        </div>
        <div
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            hasCustomInputs
              ? 'bg-[rgba(210,166,78,0.16)] text-[var(--color-accent-strong)]'
              : 'bg-[rgba(22,49,45,0.06)] text-slate-600'
          }`}
        >
          {hasCustomInputs ? 'Custom scenario active' : 'Workbook defaults active'}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {percentFields.map(({ field, label, helper }) => (
          <label
            key={field}
            className="rounded-[1.5rem] border border-[var(--color-border)] bg-white/82 px-4 py-4 shadow-[0_14px_32px_rgba(19,49,44,0.05)]"
          >
            <span className="text-sm font-semibold text-[var(--color-ink)]">
              {label}
            </span>
            <input
              aria-label={label}
              type="number"
              min="0"
              max="100"
              step="0.1"
              className="mt-3 w-full rounded-2xl border border-[var(--color-border)] bg-[rgba(248,243,232,0.82)] px-4 py-3 text-base font-semibold text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)]"
              value={toPercentInput(inputs[field])}
              onChange={(event) => {
                onPercentChange(field, fromPercentInput(event.target.value))
              }}
            />
            <span className="mt-3 block text-xs leading-5 text-slate-500">
              {helper} Default {toPercentInput(defaults[field])}%.
            </span>
          </label>
        ))}

        <label className="rounded-[1.5rem] border border-[var(--color-border)] bg-white/82 px-4 py-4 shadow-[0_14px_32px_rgba(19,49,44,0.05)] lg:col-span-2">
          <span className="text-sm font-semibold text-[var(--color-ink)]">
            Platform annual fee (USD)
          </span>
          <input
            aria-label="Platform annual fee (USD)"
            type="number"
            min="0"
            step="500"
            className="mt-3 w-full rounded-2xl border border-[var(--color-border)] bg-[rgba(248,243,232,0.82)] px-4 py-3 text-base font-semibold text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)]"
            value={inputs.platformAnnualFee}
            onChange={(event) => {
              onCurrencyChange('platformAnnualFee', Number(event.target.value))
            }}
          />
          <span className="mt-3 block text-xs leading-5 text-slate-500">
            Default ${defaults.platformAnnualFee.toLocaleString('en-US')}. Revenue
            scales linearly with the annual community fee.
          </span>
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5"
          onClick={onReset}
        >
          Reset to workbook defaults
        </button>
        <button
          type="button"
          className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
            hasCustomInputs
              ? 'bg-[var(--color-ink)] text-white hover:-translate-y-0.5'
              : 'cursor-not-allowed bg-slate-200 text-slate-500'
          }`}
          onClick={onDownload}
          disabled={!hasCustomInputs}
        >
          Download local copy
        </button>
      </div>
    </div>
  )
}

function toPercentInput(value: number) {
  return Number((value * 100).toFixed(1))
}

function fromPercentInput(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed / 100 : 0
}
