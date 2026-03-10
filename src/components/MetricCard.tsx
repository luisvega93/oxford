interface MetricCardProps {
  label: string
  value: string
  accent?: boolean
}

export function MetricCard({ label, value, accent = false }: MetricCardProps) {
  return (
    <article
      className={`rounded-[1.75rem] border p-5 shadow-[0_20px_60px_rgba(19,49,44,0.08)] ${
        accent
          ? 'border-amber-300/60 bg-[linear-gradient(140deg,rgba(210,166,78,0.18),rgba(255,248,233,0.95))]'
          : 'border-white/70 bg-white/82'
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
        {value}
      </p>
    </article>
  )
}
