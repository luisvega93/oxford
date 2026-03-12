import type { DashboardContent } from '../types/dashboard'

export const editorialContent: DashboardContent = {
  hero: {
    eyebrow: 'Selected model',
    headline: 'Broker + Royalty + Platform',
    summary:
      'Alternative 5 captures transaction access, design-system royalties, and recurring platform fees without taking development balance-sheet risk.',
    callout:
      'It remains the most capital-efficient option in the current model: more than $100M of 10-year net cash flow with less than $1M of peak drawdown.',
  },
  comparisonIntro:
    'The dashboard compares each business model on upside, capital intensity, and payback so investors can see the trade-off between absolute returns and execution risk.',
  methodologyNote:
    'This dashboard is a static snapshot of the current workbook. Revenue is cash in, costs are cash out, net cash flow is revenue minus costs, and capital requirement reflects peak cumulative drawdown over the first 10 years.',
  footerTitle: 'Model basis',
  alternatives: {
    'alternative-1': {
      tagline: 'Proof-of-concept development plus a royalty tail.',
      explanation:
        'This model monetizes access first, develops the first project to prove the concept, and then extends the system through IP royalties on future communities.',
      pros: [
        'Combines transaction access, direct development economics, and a royalty stream in later years.',
        'Generates strong absolute 10-year cash flow once the first project is delivered.',
        'Creates a clear proof point for the brand and design system.',
      ],
      cons: [
        'Requires the deepest capital drawdown in the set.',
        'Payback does not arrive until Year 5, so early risk concentration is high.',
        'Puts both construction execution and future royalty adoption at risk.',
      ],
      investorAngle:
        'High upside if the first project lands, but the early cash profile looks much more like a developer than a capital-light platform.',
    },
    'alternative-2': {
      tagline: 'A lighter recurring platform-and-operations stack.',
      explanation:
        'Alternative 2 blends brokerage access with operations and community fees, prioritizing recurring cash generation over development upside.',
      pros: [
        'Very low capital requirement with payback by Year 3.',
        'Recurring fees and operations revenue diversify the income stream.',
        'Execution risk is materially lower than the developer-led options.',
      ],
      cons: [
        'Produces the lowest 10-year net cash flow among the five choices.',
        'Depends on communities reaching occupancy before the model truly compounds.',
        'Has less strategic control over the product than a model that includes development or IP ownership.',
      ],
      investorAngle:
        'A credible low-risk structure, but it leaves substantial upside on the table versus the stronger royalty or development combinations.',
    },
    'alternative-3': {
      tagline: 'Maximum upside with the heaviest operating complexity.',
      explanation:
        'This option layers brokerage, first-project development, and fractional inventory monetization to create the highest modeled 10-year payoff.',
      pros: [
        'Highest 10-year revenue and net cash flow in the current model.',
        'Captures upside from both project delivery and hospitality-style fractional demand.',
        'Provides multiple monetization paths once the first project is online.',
      ],
      cons: [
        'Still requires a large six-figure drawdown before cash generation inflects.',
        'Adds fractional-sales execution risk on top of development risk.',
        'Operational complexity is meaningfully higher than the platform-led options.',
      ],
      investorAngle:
        'The biggest swing on paper, but it combines capital needs with a more complex operating story than most investors will prefer for an early platform.',
    },
    'alternative-4': {
      tagline: 'Fast payback from development paired with recurring operations.',
      explanation:
        'Alternative 4 uses the first project to create development upside, then extends the economics with fractionals and community operations.',
      pros: [
        'Produces the earliest payback of the capital-intensive options.',
        'Generates strong 10-year net cash flow with a recurring operations layer.',
        'Balances one-time project upside with a steadier post-delivery revenue stream.',
      ],
      cons: [
        'Still demands a large upfront drawdown during the development years.',
        'Exposes the business to both project delivery risk and operational execution risk.',
        'Has lower headline upside than Alternative 3 while remaining capital heavy.',
      ],
      investorAngle:
        'A more balanced version of the developer path, but it still asks investors to underwrite real project risk before the recurring cash flow arrives.',
    },
    'alternative-5': {
      tagline: 'The recommended capital-light model.',
      explanation:
        'Alternative 5 combines brokerage access, future-project royalties, and recurring platform fees into a diversified revenue stack that scales without direct development capital.',
      pros: [
        'Smallest capital requirement in the set, with peak drawdown still under $1M.',
        'Still exceeds $100M of 10-year net cash flow at roughly a 70% net margin.',
        'Blends one-time, long-tail, and recurring revenue streams into a diversified investor story.',
      ],
      cons: [
        'Payback shifts to Year 5 under the latest model assumptions.',
        'Delivers less absolute upside than the development-heavy models.',
        'Relies on third-party developers to bring projects to market.',
        'Recurring platform and royalty cash flows activate later than the developer-heavy paths.',
      ],
      investorAngle:
        'This is still the cleanest investor proposition: strong cash generation, multiple revenue streams, and dramatically lower capital intensity than the developer-led paths, even after the updated overhead assumptions.',
    },
  },
}
