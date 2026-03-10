import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { Alternative } from '../types/dashboard'
import { formatCurrencyCompact } from '../utils/format'

interface ProjectionChartProps {
  alternative: Alternative
}

export function ProjectionChart({ alternative }: ProjectionChartProps) {
  return (
    <div className="panel h-[27rem] w-full p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
            Annual cash flow profile
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Bars show yearly revenue, costs, and net cash flow. The line tracks
            cumulative cash flow across the 10-year horizon.
          </p>
        </div>
        <div className="rounded-full border border-[var(--color-border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--color-ink)]">
          {alternative.name}
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={alternative.projections}
          margin={{ top: 10, right: 16, bottom: 10, left: 4 }}
        >
          <CartesianGrid stroke="rgba(19,49,44,0.12)" strokeDasharray="4 6" />
          <XAxis
            dataKey="year"
            stroke="rgba(19,49,44,0.62)"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            yAxisId="cash"
            tickFormatter={(value) => formatCurrencyCompact(value)}
            stroke="rgba(19,49,44,0.62)"
            tick={{ fontSize: 12 }}
            width={92}
          />
          <YAxis
            yAxisId="cumulative"
            orientation="right"
            tickFormatter={(value) => formatCurrencyCompact(value)}
            stroke="rgba(19,49,44,0.62)"
            tick={{ fontSize: 12 }}
            width={92}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) {
                return null
              }

              const row = payload[0].payload as Alternative['projections'][number]

              return (
                <div className="rounded-3xl border border-[var(--color-border)] bg-[rgba(248,243,232,0.98)] px-4 py-3 shadow-[0_20px_60px_rgba(19,49,44,0.12)]">
                  <p className="font-semibold text-[var(--color-ink)]">Year {label}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Revenue: {formatCurrencyCompact(row.revenue)}
                  </p>
                  <p className="text-sm text-slate-600">
                    Costs: {formatCurrencyCompact(row.costs)}
                  </p>
                  <p className="text-sm text-slate-600">
                    Net cash flow: {formatCurrencyCompact(row.netCashFlow)}
                  </p>
                  <p className="text-sm text-slate-600">
                    Cumulative: {formatCurrencyCompact(row.cumulativeCashFlow)}
                  </p>
                </div>
              )
            }}
          />
          <Legend verticalAlign="top" height={30} />
          <Bar
            yAxisId="cash"
            dataKey="revenue"
            name="Revenue"
            fill="#d0a24b"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            yAxisId="cash"
            dataKey="costs"
            name="Costs"
            fill="#b7c3b4"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            yAxisId="cash"
            dataKey="netCashFlow"
            name="Net cash flow"
            fill="#16312d"
            radius={[8, 8, 0, 0]}
          />
          <Line
            yAxisId="cumulative"
            dataKey="cumulativeCashFlow"
            name="Cumulative cash flow"
            stroke="#a34d2d"
            strokeWidth={3}
            dot={{ r: 3, fill: '#a34d2d' }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
