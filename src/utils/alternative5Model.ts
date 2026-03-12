import type {
  Alternative,
  Alternative5Inputs,
  Alternative5ModelingData,
  AnnualProjection,
} from '../types/dashboard'

export interface Alternative5LocalCopy {
  savedAt: string
  sourceWorkbook: string
  inputs: Alternative5Inputs
  summary: Pick<
    Alternative,
    | 'name'
    | 'tenYearRevenue'
    | 'tenYearCosts'
    | 'tenYearNetCashFlow'
    | 'capitalRequirement'
    | 'peakDrawdownAbs'
    | 'netMargin'
    | 'payback'
  >
  projections: AnnualProjection[]
  components: {
    broker: AnnualProjection[]
    royalty: AnnualProjection[]
    platform: AnnualProjection[]
  }
}

export function sanitizeAlternative5Inputs(
  inputs: Alternative5Inputs,
): Alternative5Inputs {
  return {
    brokerEquityPct: clamp(inputs.brokerEquityPct, 0, 1),
    brokerAdminCostPct: clamp(inputs.brokerAdminCostPct, 0, 1),
    royaltyRatePct: clamp(inputs.royaltyRatePct, 0, 1),
    royaltyAdminCostPct: clamp(inputs.royaltyAdminCostPct, 0, 1),
    platformAnnualFee: Math.max(0, Math.round(inputs.platformAnnualFee)),
    platformNetMarginPct: clamp(inputs.platformNetMarginPct, 0, 1),
  }
}

export function areAlternative5InputsEqual(
  left: Alternative5Inputs,
  right: Alternative5Inputs,
) {
  return (
    left.brokerEquityPct === right.brokerEquityPct &&
    left.brokerAdminCostPct === right.brokerAdminCostPct &&
    left.royaltyRatePct === right.royaltyRatePct &&
    left.royaltyAdminCostPct === right.royaltyAdminCostPct &&
    left.platformAnnualFee === right.platformAnnualFee &&
    left.platformNetMarginPct === right.platformNetMarginPct
  )
}

export function buildAlternative5Model(
  baseAlternative: Alternative,
  modeling: Alternative5ModelingData,
  rawInputs: Alternative5Inputs,
) {
  const inputs = sanitizeAlternative5Inputs(rawInputs)
  const broker = adjustBroker(modeling, inputs)
  const royalty = adjustRoyalty(modeling, inputs)
  const platform = adjustPlatform(modeling, inputs)
  const projections = combineComponents([broker, royalty, platform])
  const tenYearRevenue = sumBy(projections, 'revenue')
  const tenYearCosts = sumBy(projections, 'costs')
  const tenYearNetCashFlow = sumBy(projections, 'netCashFlow')
  const capitalRequirement = Math.min(0, ...projections.map((row) => row.cumulativeCashFlow))
  const peakDrawdownAbs = Math.abs(capitalRequirement)
  const netMargin = tenYearRevenue === 0 ? 0 : tenYearNetCashFlow / tenYearRevenue

  return {
    alternative: {
      ...baseAlternative,
      tenYearRevenue,
      tenYearCosts,
      tenYearNetCashFlow,
      capitalRequirement,
      peakDrawdownAbs,
      netMargin,
      payback: derivePayback(projections),
      projections,
    },
    components: {
      broker,
      royalty,
      platform,
    },
    inputs,
  }
}

export function buildAlternative5LocalCopy(
  sourceWorkbook: string,
  alternative: Alternative,
  components: {
    broker: AnnualProjection[]
    royalty: AnnualProjection[]
    platform: AnnualProjection[]
  },
  inputs: Alternative5Inputs,
): Alternative5LocalCopy {
  return {
    savedAt: new Date().toISOString(),
    sourceWorkbook,
    inputs,
    summary: {
      name: alternative.name,
      tenYearRevenue: alternative.tenYearRevenue,
      tenYearCosts: alternative.tenYearCosts,
      tenYearNetCashFlow: alternative.tenYearNetCashFlow,
      capitalRequirement: alternative.capitalRequirement,
      peakDrawdownAbs: alternative.peakDrawdownAbs,
      netMargin: alternative.netMargin,
      payback: alternative.payback,
    },
    projections: alternative.projections,
    components,
  }
}

function adjustBroker(
  modeling: Alternative5ModelingData,
  inputs: Alternative5Inputs,
) {
  const defaults = modeling.defaultInputs
  const revenueRatio =
    defaults.brokerEquityPct === 0 ? 0 : inputs.brokerEquityPct / defaults.brokerEquityPct
  const firstPositiveRevenueYear = modeling.components.broker.find(
    (projection) => projection.revenue > 0,
  )?.year
  const firstPositiveYearFixedCost =
    firstPositiveRevenueYear === undefined
      ? 0
      : Math.max(
          0,
          modeling.components.broker[firstPositiveRevenueYear - 1].costs -
            modeling.components.broker[firstPositiveRevenueYear - 1].revenue *
              defaults.brokerAdminCostPct,
        )

  const adjusted = modeling.components.broker.map((projection) => {
    const revenue = roundMoney(projection.revenue * revenueRatio)
    const firstRevenueYear =
      firstPositiveRevenueYear !== undefined && revenueRatio > 0
        ? firstPositiveRevenueYear
        : undefined
    const fixedCost = getBrokerFixedCost(
      projection.year,
      firstRevenueYear,
      firstPositiveYearFixedCost,
      modeling.brokerPreSalesOverheadAnnual,
    )
    const variableCost = roundMoney(revenue * inputs.brokerAdminCostPct)
    const costs = roundMoney(fixedCost + variableCost)

    return {
      year: projection.year,
      revenue,
      costs,
      netCashFlow: roundMoney(revenue - costs),
      cumulativeCashFlow: 0,
    }
  })

  return withCumulativeCashFlow(adjusted)
}

function adjustRoyalty(
  modeling: Alternative5ModelingData,
  inputs: Alternative5Inputs,
) {
  const defaults = modeling.defaultInputs
  const revenueRatio =
    defaults.royaltyRatePct === 0 ? 0 : inputs.royaltyRatePct / defaults.royaltyRatePct

  const adjusted = modeling.components.royalty.map((projection) => {
    const revenue = roundMoney(projection.revenue * revenueRatio)
    const costs = roundMoney(revenue * inputs.royaltyAdminCostPct)

    return {
      year: projection.year,
      revenue,
      costs,
      netCashFlow: roundMoney(revenue - costs),
      cumulativeCashFlow: 0,
    }
  })

  return withCumulativeCashFlow(adjusted)
}

function adjustPlatform(
  modeling: Alternative5ModelingData,
  inputs: Alternative5Inputs,
) {
  const defaults = modeling.defaultInputs
  const revenueRatio =
    defaults.platformAnnualFee === 0
      ? 0
      : inputs.platformAnnualFee / defaults.platformAnnualFee

  const adjusted = modeling.components.platform.map((projection) => {
    const revenue = roundMoney(projection.revenue * revenueRatio)
    const costs = roundMoney(revenue * (1 - inputs.platformNetMarginPct))

    return {
      year: projection.year,
      revenue,
      costs,
      netCashFlow: roundMoney(revenue - costs),
      cumulativeCashFlow: 0,
    }
  })

  return withCumulativeCashFlow(adjusted)
}

function combineComponents(componentSets: AnnualProjection[][]) {
  return withCumulativeCashFlow(
    componentSets[0].map((projection, index) => {
      const revenue = sum(componentSets.map((set) => set[index].revenue))
      const costs = sum(componentSets.map((set) => set[index].costs))
      const netCashFlow = sum(componentSets.map((set) => set[index].netCashFlow))

      return {
        year: projection.year,
        revenue: roundMoney(revenue),
        costs: roundMoney(costs),
        netCashFlow: roundMoney(netCashFlow),
        cumulativeCashFlow: 0,
      }
    }),
  )
}

function withCumulativeCashFlow(projections: AnnualProjection[]) {
  let cumulativeCashFlow = 0

  return projections.map((projection) => {
    cumulativeCashFlow = roundMoney(cumulativeCashFlow + projection.netCashFlow)

    return {
      ...projection,
      cumulativeCashFlow,
    }
  })
}

function derivePayback(projections: AnnualProjection[]) {
  const minimumCumulative = Math.min(...projections.map((row) => row.cumulativeCashFlow))

  if (minimumCumulative >= 0) {
    return 'Cash-positive (no drawdown)'
  }

  const paybackYear = projections.find((row) => row.cumulativeCashFlow >= 0)?.year
  return paybackYear ? `Year ${paybackYear}` : 'Beyond Year 10'
}

function getBrokerFixedCost(
  year: number,
  firstRevenueYear: number | undefined,
  partialStartYearFixedCost: number,
  annualPreSalesOverhead: number,
) {
  if (!firstRevenueYear) {
    return annualPreSalesOverhead
  }

  if (year < firstRevenueYear) {
    return annualPreSalesOverhead
  }

  if (year === firstRevenueYear) {
    return partialStartYearFixedCost
  }

  return 0
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0)
}

function sumBy<T extends keyof AnnualProjection>(
  projections: AnnualProjection[],
  key: T,
) {
  return roundMoney(projections.reduce((total, projection) => total + projection[key], 0))
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function roundMoney(value: number) {
  return Math.round(value)
}
