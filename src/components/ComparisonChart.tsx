import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { Alternative } from '../types/dashboard'
import { formatCurrencyCompact } from '../utils/format'

interface ComparisonChartProps {
  alternatives: Alternative[]
  selectedAlternativeId: string
}

export function ComparisonChart({
  alternatives,
  selectedAlternativeId,
}: ComparisonChartProps) {
  const capitalDomainMax = getAxisCeiling(
    alternatives.map((alternative) => alternative.peakDrawdownAbs),
  )
  const netCashFlowDomainMax = getAxisCeiling(
    alternatives.map((alternative) => alternative.tenYearNetCashFlow),
  )

  const selectedData = alternatives
    .filter(
      (alternative) =>
        alternative.id === selectedAlternativeId && !alternative.recommended,
    )
    .map(toChartPoint)

  const recommendedData = alternatives
    .filter((alternative) => alternative.recommended)
    .map(toChartPoint)

  const comparisonData = alternatives
    .filter(
      (alternative) =>
        alternative.id !== selectedAlternativeId && !alternative.recommended,
    )
    .map(toChartPoint)

  return (
    <div className="panel h-[25rem] w-full p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
            Net cash flow vs. capital required
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Up and left is better. Alternative 5 is highlighted so you can see
            how its live capital intensity and cash generation move as the
            editable assumptions change.
          </p>
        </div>
      </div>

      <div className="relative h-[18.75rem] pl-10 sm:pl-12">
        <p className="pointer-events-none absolute bottom-2 left-10 right-0 text-center text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Capital required
        </p>
        <p className="pointer-events-none absolute left-[-2.35rem] top-1/2 origin-center -translate-y-1/2 -rotate-90 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          10-year net cash flow
        </p>

        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 22, bottom: 34, left: 4 }}>
            <CartesianGrid stroke="rgba(19,49,44,0.12)" strokeDasharray="4 6" />
            <ReferenceLine
              x={0}
              stroke="rgba(19,49,44,0.22)"
              strokeDasharray="4 6"
            />
            <XAxis
              type="number"
              dataKey="capitalRequired"
              domain={[0, capitalDomainMax]}
              tickFormatter={(value) => formatCurrencyCompact(value)}
              stroke="rgba(19,49,44,0.62)"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              padding={{ left: 18, right: 18 }}
            />
            <YAxis
              type="number"
              dataKey="netCashFlow"
              domain={[0, netCashFlowDomainMax]}
              tickFormatter={(value) => formatCurrencyCompact(value)}
              stroke="rgba(19,49,44,0.62)"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={88}
            />
            <Tooltip
              cursor={{ strokeDasharray: '4 4' }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) {
                  return null
                }

                const point = payload[0].payload as ReturnType<typeof toChartPoint>

                return (
                  <div className="rounded-3xl border border-[var(--color-border)] bg-[rgba(248,243,232,0.98)] px-4 py-3 shadow-[0_20px_60px_rgba(19,49,44,0.12)]">
                    <p className="font-semibold text-[var(--color-ink)]">
                      {point.name}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Net cash flow: {formatCurrencyCompact(point.netCashFlow)}
                    </p>
                    <p className="text-sm text-slate-600">
                      Capital required: {formatCurrencyCompact(point.capitalRequired)}
                    </p>
                  </div>
                )
              }}
            />
            <Scatter data={comparisonData} fill="#8d9e8d" shape={renderBasePoint} />
            <Scatter data={selectedData} fill="#c17a3f" shape={renderHighlightPoint} />
            <Scatter
              data={recommendedData}
              fill="#16312d"
              shape={renderRecommendedPoint}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function toChartPoint(alternative: Alternative) {
  return {
    id: alternative.id,
    name: alternative.name,
    capitalRequired: alternative.peakDrawdownAbs,
    netCashFlow: alternative.tenYearNetCashFlow,
  }
}

function getAxisCeiling(values: number[]) {
  const maxValue = Math.max(...values)

  if (maxValue <= 2_000_000) {
    return Math.ceil(maxValue / 250_000) * 250_000
  }

  if (maxValue <= 20_000_000) {
    return Math.ceil(maxValue / 5_000_000) * 5_000_000
  }

  return Math.ceil(maxValue / 20_000_000) * 20_000_000
}

function renderBasePoint(props: { cx?: number; cy?: number; fill?: string }) {
  return renderPoint(props, 6)
}

function renderHighlightPoint(props: { cx?: number; cy?: number; fill?: string }) {
  return renderPoint(props, 7)
}

function renderRecommendedPoint(props: { cx?: number; cy?: number; fill?: string }) {
  return renderPoint(props, 7.5)
}

function renderPoint(
  props: { cx?: number; cy?: number; fill?: string },
  radius: number,
) {
  return (
    <circle
      cx={props.cx}
      cy={props.cy}
      r={radius}
      fill={props.fill}
      stroke="rgba(255,255,255,0.95)"
      strokeWidth={3}
    />
  )
}
