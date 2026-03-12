import type { DashboardData } from '../types/dashboard'

export const generatedDashboardData: DashboardData = {
  "source": {
    "workbook": "The Commons Model v4.xlsx",
    "generatedAt": "2026-03-12T01:59:56.679Z"
  },
  "scenarios": {
    "a": {
      "code": "a",
      "title": "BROKER ROLE (Equity stake → “units equivalent” sold like the developer)",
      "summary": "We broker the deal (between landowners - developers) and earn an equity-like slice that’s treated as if we “own” 5% of the homes being sold. We get paid as homes are sold, on the same schedule as the project’s sales cash receipts.",
      "cashFlowLines": [
        "Revenue to us = Equity stake % × gross unit sales cash receipts (deposits + closings) for the scope selected.",
        "Costs to us = $300k annual overhead from model start until broker sales begin; thereafter Broker admin expense % × broker revenue (default 10%).",
        "No developer profit share / capital calls are used in this scenario anymore (it’s “units-equivalent” sales)."
      ],
      "keyTakeaway": "This behaves like a revenue-share tied to home sales timing, not like being a co-developer putting cash in."
    },
    "b": {
      "code": "b",
      "title": "DEVELOPER (Project 1 only)",
      "summary": "We act as the developer for the first project only—we pay the project’s costs and we receive the project’s cash inflows.",
      "cashFlowLines": [
        "The dashboard pulls Project 1 developer cashflow from the model.",
        "“Revenue” = all positive developer cashflow items.",
        "“Costs” = all negative developer cashflow items (cash out).",
        "Net = the true developer net cash movement each year."
      ],
      "keyTakeaway": "This is the most “real” version of development economics: you spend first, you get paid later (so payback/IRR usually matter)."
    },
    "c": {
      "code": "c",
      "title": "MASTER PLAN / ARCHITECTURE / MANIFESTO ROYALTY (on “future” projects)",
      "summary": "We create the “system” (master plan + design + manifesto) and earn a royalty on home sales in future Commons projects.",
      "cashFlowLines": [
        "Royalty revenue = Royalty % × selected gross unit sales cash receipts, activated once Project 1 reaches 80% sold-out.",
        "Costs = optional Royalty admin expense % (default 10%) on activated royalty revenue.",
        "Royalty % (default 5%)"
      ],
      "keyTakeaway": "Typically no upfront investment is modeled here, so IRR/MOIC are often N/A (it’s mainly a “cash-in stream”)."
    },
    "e": {
      "code": "e",
      "title": "SELL FRACTIONALS FROM OUR EQUITY (weeks)",
      "summary": "Instead of waiting for equity value, we turn our stake into “units equivalent” and sell weeks of usage (like fractional time-based occupancy).",
      "cashFlowLines": [
        "1. Units equivalent = Equity % owned × Total units in scope",
        "2. Weeks available = Units equivalent × Weeks per unit",
        "3. Weeks sold = Weeks available × % weeks sold",
        "4. Revenue = Weeks sold × Price per week (grows annually)",
        "5. Costs = Operating cost % × Revenue",
        "6. Net = Revenue − Costs",
        "Main inputs:",
        "% weeks sold (default 60%)",
        "Price per week (Year 1) (default $4,000)",
        "Annual price growth (default 5%)",
        "Operating cost % of revenue (default 10%)"
      ],
      "keyTakeaway": "This is not tied to the home-sales schedule—it’s a separate “hospitality-style” revenue stream driven by occupancy and pricing."
    },
    "g": {
      "code": "g",
      "title": "OPERATIONS / COMMUNITY MANAGER (all communities)",
      "summary": "We operate completed communities and collect the operating cashflows already modeled in the platform roll-up, net of central overhead.",
      "cashFlowLines": [
        "Revenue = project-level operating cashflows aggregated across all successful communities.",
        "Costs = central platform overhead at the holding-company level."
      ],
      "keyTakeaway": "This is an asset-light operating model: value comes from managing communities after they come online, rather than from development profit."
    },
    "h": {
      "code": "h",
      "title": "PLATFORM COMMUNITY FEES (all communities)",
      "summary": "We earn recurring community fees from completed homes across every successful Commons community.",
      "cashFlowLines": [
        "Revenue = occupied homes × $15,000 annual fee ÷ 12, aggregated monthly across all successful communities.",
        "Costs = 65% of revenue (35% net margin assumption)."
      ],
      "keyTakeaway": "This is a recurring, subscription-like platform model that scales as more homes are delivered and occupied."
    }
  },
  "alternatives": [
    {
      "id": "alternative-1",
      "order": 1,
      "name": "Broker + Developer + Royalty",
      "displayName": "1) Broker + Developer + Royalty",
      "shortLabel": "Alternative 1",
      "thesis": "Capture transaction access, first-project development economics, then scale with IP royalties.",
      "includedScenarioCodes": [
        "a",
        "b",
        "c"
      ],
      "includedScenarioLabel": "a + b + c",
      "tenYearRevenue": 307262474,
      "tenYearCosts": 165590767,
      "tenYearNetCashFlow": 141671707,
      "capitalRequirement": -141537294,
      "peakDrawdownAbs": 141537294,
      "payback": "Year 5",
      "netMargin": 0.4610771538603181,
      "recommended": false,
      "projections": [
        {
          "year": 1,
          "revenue": 0,
          "costs": 300000,
          "netCashFlow": -300000,
          "cumulativeCashFlow": -300000
        },
        {
          "year": 2,
          "revenue": 0,
          "costs": 300000,
          "netCashFlow": -300000,
          "cumulativeCashFlow": -600000
        },
        {
          "year": 3,
          "revenue": 0,
          "costs": 67515349,
          "netCashFlow": -67515349,
          "cumulativeCashFlow": -68115349
        },
        {
          "year": 4,
          "revenue": 281250,
          "costs": 73703196,
          "netCashFlow": -73421946,
          "cumulativeCashFlow": -141537294
        },
        {
          "year": 5,
          "revenue": 189866097,
          "costs": 15765972,
          "netCashFlow": 174100124,
          "cumulativeCashFlow": 32562830
        },
        {
          "year": 6,
          "revenue": 80177627,
          "costs": 4312500,
          "netCashFlow": 75865127,
          "cumulativeCashFlow": 108427957
        },
        {
          "year": 7,
          "revenue": 33187500,
          "costs": 3318750,
          "netCashFlow": 29868750,
          "cumulativeCashFlow": 138296707
        },
        {
          "year": 8,
          "revenue": 3750000,
          "costs": 375000,
          "netCashFlow": 3375000,
          "cumulativeCashFlow": 141671707
        },
        {
          "year": 9,
          "revenue": 0,
          "costs": 0,
          "netCashFlow": 0,
          "cumulativeCashFlow": 141671707
        },
        {
          "year": 10,
          "revenue": 0,
          "costs": 0,
          "netCashFlow": 0,
          "cumulativeCashFlow": 141671707
        }
      ]
    },
    {
      "id": "alternative-2",
      "order": 2,
      "name": "Operations + Platform + Broker",
      "displayName": "2) Operations + Platform + Broker",
      "shortLabel": "Alternative 2",
      "thesis": "Capital-light recurring model built on brokerage, community operations, and platform fees.",
      "includedScenarioCodes": [
        "g",
        "h",
        "a"
      ],
      "includedScenarioLabel": "g + h + a",
      "tenYearRevenue": 123560510,
      "tenYearCosts": 44250000,
      "tenYearNetCashFlow": 79310510,
      "capitalRequirement": -975000,
      "peakDrawdownAbs": 975000,
      "payback": "Year 3",
      "netMargin": 0.6418758711824676,
      "recommended": false,
      "projections": [
        {
          "year": 1,
          "revenue": 186250,
          "costs": 800000,
          "netCashFlow": -613750,
          "cumulativeCashFlow": -613750
        },
        {
          "year": 2,
          "revenue": 438750,
          "costs": 800000,
          "netCashFlow": -361250,
          "cumulativeCashFlow": -975000
        },
        {
          "year": 3,
          "revenue": 3243216,
          "costs": 800000,
          "netCashFlow": 2443216,
          "cumulativeCashFlow": 1468216
        },
        {
          "year": 4,
          "revenue": 3556952,
          "costs": 753125,
          "netCashFlow": 2803827,
          "cumulativeCashFlow": 4272044
        },
        {
          "year": 5,
          "revenue": 19828804,
          "costs": 2832813,
          "netCashFlow": 16995991,
          "cumulativeCashFlow": 21268035
        },
        {
          "year": 6,
          "revenue": 30873671,
          "costs": 6243750,
          "netCashFlow": 24629921,
          "cumulativeCashFlow": 45897956
        },
        {
          "year": 7,
          "revenue": 28485180,
          "costs": 8415625,
          "netCashFlow": 20069555,
          "cumulativeCashFlow": 65967511
        },
        {
          "year": 8,
          "revenue": 13718687,
          "costs": 7979688,
          "netCashFlow": 5738999,
          "cumulativeCashFlow": 71706510
        },
        {
          "year": 9,
          "revenue": 11655000,
          "costs": 7812500,
          "netCashFlow": 3842500,
          "cumulativeCashFlow": 75549010
        },
        {
          "year": 10,
          "revenue": 11574000,
          "costs": 7812500,
          "netCashFlow": 3761500,
          "cumulativeCashFlow": 79310510
        }
      ]
    },
    {
      "id": "alternative-3",
      "order": 3,
      "name": "Broker + Developer + Fractionals",
      "displayName": "3) Broker + Developer + Fractionals",
      "shortLabel": "Alternative 3",
      "thesis": "Blend brokerage and development upside with hospitality-style monetisation of owned inventory.",
      "includedScenarioCodes": [
        "a",
        "b",
        "e"
      ],
      "includedScenarioLabel": "a + b + e",
      "tenYearRevenue": 375819048,
      "tenYearCosts": 172446424,
      "tenYearNetCashFlow": 203372624,
      "capitalRequirement": -113652801,
      "peakDrawdownAbs": 113652801,
      "payback": "Year 2",
      "netMargin": 0.5411450672399127,
      "recommended": false,
      "projections": [
        {
          "year": 1,
          "revenue": 0,
          "costs": 300000,
          "netCashFlow": -300000,
          "cumulativeCashFlow": -300000
        },
        {
          "year": 2,
          "revenue": 9828000,
          "costs": 1282800,
          "netCashFlow": 8545200,
          "cumulativeCashFlow": 8245200
        },
        {
          "year": 3,
          "revenue": 10319400,
          "costs": 68547289,
          "netCashFlow": -58227889,
          "cumulativeCashFlow": -49982689
        },
        {
          "year": 4,
          "revenue": 11116620,
          "costs": 74786733,
          "netCashFlow": -63670113,
          "cumulativeCashFlow": -113652801
        },
        {
          "year": 5,
          "revenue": 200524485,
          "costs": 16831811,
          "netCashFlow": 183692674,
          "cumulativeCashFlow": 70039873
        },
        {
          "year": 6,
          "revenue": 71498622,
          "costs": 3444600,
          "netCashFlow": 68054023,
          "cumulativeCashFlow": 138093895
        },
        {
          "year": 7,
          "revenue": 29137045,
          "costs": 2913705,
          "netCashFlow": 26223341,
          "cumulativeCashFlow": 164317236
        },
        {
          "year": 8,
          "revenue": 15045460,
          "costs": 1504546,
          "netCashFlow": 13540914,
          "cumulativeCashFlow": 177858150
        },
        {
          "year": 9,
          "revenue": 13828983,
          "costs": 1382898,
          "netCashFlow": 12446085,
          "cumulativeCashFlow": 190304235
        },
        {
          "year": 10,
          "revenue": 14520432,
          "costs": 1452043,
          "netCashFlow": 13068389,
          "cumulativeCashFlow": 203372624
        }
      ]
    },
    {
      "id": "alternative-4",
      "order": 4,
      "name": "Developer + Fractionals + Operations",
      "displayName": "4) Developer + Fractionals + Operations",
      "shortLabel": "Alternative 4",
      "thesis": "Pair first-project development upside with fractional monetisation and recurring community operations.",
      "includedScenarioCodes": [
        "b",
        "e",
        "g"
      ],
      "includedScenarioLabel": "b + e + g",
      "tenYearRevenue": 336879558,
      "tenYearCosts": 170696424,
      "tenYearNetCashFlow": 166183134,
      "capitalRequirement": -107637008,
      "peakDrawdownAbs": 107637008,
      "payback": "Year 2",
      "netMargin": 0.49330132996671766,
      "recommended": false,
      "projections": [
        {
          "year": 1,
          "revenue": 186250,
          "costs": 500000,
          "netCashFlow": -313750,
          "cumulativeCashFlow": -313750
        },
        {
          "year": 2,
          "revenue": 10266750,
          "costs": 1482800,
          "netCashFlow": 8783950,
          "cumulativeCashFlow": 8470200
        },
        {
          "year": 3,
          "revenue": 13562616,
          "costs": 68747289,
          "netCashFlow": -55184672,
          "cumulativeCashFlow": -46714472
        },
        {
          "year": 4,
          "revenue": 14111072,
          "costs": 75033608,
          "netCashFlow": -60922536,
          "cumulativeCashFlow": -107637008
        },
        {
          "year": 5,
          "revenue": 189072039,
          "costs": 15831811,
          "netCashFlow": 173240228,
          "cumulativeCashFlow": 65603220
        },
        {
          "year": 6,
          "revenue": 51997294,
          "costs": 1694600,
          "netCashFlow": 50302694,
          "cumulativeCashFlow": 115905914
        },
        {
          "year": 7,
          "revenue": 14809725,
          "costs": 1754330,
          "netCashFlow": 13055396,
          "cumulativeCashFlow": 128961310
        },
        {
          "year": 8,
          "revenue": 13795396,
          "costs": 1817046,
          "netCashFlow": 11978350,
          "cumulativeCashFlow": 140939660
        },
        {
          "year": 9,
          "revenue": 14233983,
          "costs": 1882898,
          "netCashFlow": 12351085,
          "cumulativeCashFlow": 153290745
        },
        {
          "year": 10,
          "revenue": 14844432,
          "costs": 1952043,
          "netCashFlow": 12892389,
          "cumulativeCashFlow": 166183134
        }
      ]
    },
    {
      "id": "alternative-5",
      "order": 5,
      "name": "Broker + Royalty + Platform",
      "displayName": "5) Broker + Royalty + Platform",
      "shortLabel": "Alternative 5",
      "thesis": "Stay capital-light by combining brokerage access, design/IP royalties, and platform fee streams.",
      "includedScenarioCodes": [
        "a",
        "c",
        "h"
      ],
      "includedScenarioLabel": "a + c + h",
      "tenYearRevenue": 146062500,
      "tenYearCosts": 43231250,
      "tenYearNetCashFlow": 102831250,
      "capitalRequirement": -900000,
      "peakDrawdownAbs": 900000,
      "payback": "Year 5",
      "netMargin": 0.7040222507488233,
      "recommended": true,
      "projections": [
        {
          "year": 1,
          "revenue": 0,
          "costs": 300000,
          "netCashFlow": -300000,
          "cumulativeCashFlow": -300000
        },
        {
          "year": 2,
          "revenue": 0,
          "costs": 300000,
          "netCashFlow": -300000,
          "cumulativeCashFlow": -600000
        },
        {
          "year": 3,
          "revenue": 0,
          "costs": 300000,
          "netCashFlow": -300000,
          "cumulativeCashFlow": -900000
        },
        {
          "year": 4,
          "revenue": 281250,
          "costs": 253125,
          "netCashFlow": 28125,
          "cumulativeCashFlow": -871875
        },
        {
          "year": 5,
          "revenue": 17000000,
          "costs": 2404688,
          "netCashFlow": 14595313,
          "cumulativeCashFlow": 13723438
        },
        {
          "year": 6,
          "revenue": 48500000,
          "costs": 7806250,
          "netCashFlow": 40693750,
          "cumulativeCashFlow": 54417188
        },
        {
          "year": 7,
          "revenue": 42812500,
          "costs": 9575000,
          "netCashFlow": 33237500,
          "cumulativeCashFlow": 87654688
        },
        {
          "year": 8,
          "revenue": 14968750,
          "costs": 7667188,
          "netCashFlow": 7301563,
          "cumulativeCashFlow": 94956250
        },
        {
          "year": 9,
          "revenue": 11250000,
          "costs": 7312500,
          "netCashFlow": 3937500,
          "cumulativeCashFlow": 98893750
        },
        {
          "year": 10,
          "revenue": 11250000,
          "costs": 7312500,
          "netCashFlow": 3937500,
          "cumulativeCashFlow": 102831250
        }
      ]
    }
  ]
}
