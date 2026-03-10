const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 0,
})

const textDecoder = new TextDecoder('utf-8')

export function formatCurrencyCompact(value: number) {
  return compactCurrencyFormatter.format(value)
}

export function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

export function formatPercent(value: number) {
  return percentFormatter.format(value)
}

export function formatDrawdown(value: number) {
  if (value === 0) {
    return '$0'
  }

  return formatCurrencyCompact(value)
}

export function formatGeneratedDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function paybackRank(value: string) {
  if (value.toLowerCase().includes('cash-positive')) {
    return 0
  }

  const match = value.match(/(\d+)/)
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
}

export function repairText(value: string) {
  if (!/[Ãâ]/.test(value)) {
    return value
  }

  try {
    const bytes = Uint8Array.from(
      Array.from(value, (character) => character.charCodeAt(0) & 0xff),
    )

    return textDecoder
      .decode(bytes)
      .replaceAll('→', '->')
      .replaceAll('×', 'x')
      .replaceAll('÷', '/')
  } catch {
    return value
  }
}
