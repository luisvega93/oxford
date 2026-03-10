import type { DashboardData } from '../types/dashboard'

export const generatedDashboardData: DashboardData = {
  "source": {
    "workbook": "The Commons Model v3.xlsx",
    "generatedAt": "2026-03-10T04:26:28.810Z"
  },
  "scenarios": {
    "a": {
      "code": "a",
      "title": "BROKER ROLE (Equity stake -> “units equivalent” sold like the developer)",
      "summary": "We broker the deal (between landowners - developers) and earn an equity-like slice that’s treated as if we “own” 5% of the homes being sold. We get paid as homes are sold, on the same schedule as the project’s sales cash receipts.",
      "cashFlowLines": [
        "Revenue to us = Equity stake % x gross unit sales cash receipts (deposits + closings) for the scope selected.",
        "Costs to us = optional Broker admin expense % x broker revenue (default 10%).",
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
        "Royalty revenue = Royalty % x gross unit sales cash receipts (for the selected “future” projects).",
        "Costs = optional Royalty admin expense % (default 10%).",
        "Royalty % (default 5%)"
      ],
      "keyTakeaway": "Typically no upfront investment is modeled here, so IRR/MOIC are often N/A (it’s mainly a “cash-in stream”)."
    },
    "e": {
      "code": "e",
      "title": "SELL FRACTIONALS FROM OUR EQUITY (weeks)",
      "summary": "Instead of waiting for equity value, we turn our stake into “units equivalent” and sell weeks of usage (like fractional time-based occupancy).",
      "cashFlowLines": [
        "1. Units equivalent = Equity % owned x Total units in scope",
        "2. Weeks available = Units equivalent x Weeks per unit",
        "3. Weeks sold = Weeks available x % weeks sold",
        "4. Revenue = Weeks sold x Price per week (grows annually)",
        "5. Costs = Operating cost % x Revenue",
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
        "Revenue = occupied homes x $15,000 annual fee / 12, aggregated monthly across all successful communities.",
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
      "tenYearRevenue": 312449974,
      "tenYearCosts": 164984517,
      "tenYearNetCashFlow": 147465457,
      "capitalRequirement": -140412294,
      "peakDrawdownAbs": 140412294,
      "payback": "Year 5",
      "netMargin": 0.47196501607006053,
      "recommended": false,
      "projections": [
        {
          "year": 1,
          "revenue": 0,
          "costs": 0,
          "netCashFlow": 0,
          "cumulativeCashFlow": 0
        },
        {
          "year": 2,
          "revenue": 0,
          "costs": 0,
          "netCashFlow": 0,
          "cumulativeCashFlow": 0
        },
        {
          "year": 3,
          "revenue": 0,
          "costs": 67215349,
          "netCashFlow": -67215349,
          "cumulativeCashFlow": -67215349
        },
        {
          "year": 4,
          "revenue": 281250,
          "costs": 73478196,
          "netCashFlow": -73196946,
          "cumulativeCashFlow": -140412294
        },
        {
          "year": 5,
          "revenue": 195053597,
          "costs": 16284722,
          "netCashFlow": 178768874,
          "cumulativeCashFlow": 38356580
        },
        {
          "year": 6,
          "revenue": 80177627,
          "costs": 4312500,
          "netCashFlow": 75865127,
          "cumulativeCashFlow": 114221707
        },
        {
          "year": 7,
          "revenue": 33187500,
          "costs": 3318750,
          "netCashFlow": 29868750,
          "cumulativeCashFlow": 144090457
        },
        {
          "year": 8,
          "revenue": 3750000,
          "costs": 375000,
          "netCashFlow": 3375000,
          "cumulativeCashFlow": 147465457
        },
        {
          "year": 9,
          "revenue": 0,
          "costs": 0,
          "netCashFlow": 0,
          "cumulativeCashFlow": 147465457
        },
        {
          "year": 10,
          "revenue": 0,
          "costs": 0,
          "netCashFlow": 0,
          "cumulativeCashFlow": 147465457
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
      "tenYearCosts": 43125000,
      "tenYearNetCashFlow": 80435510,
      "capitalRequirement": -375000,
      "peakDrawdownAbs": 375000,
      "payback": "Year 3",
      "netMargin": 0.6509807219151167,
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
          "revenue": 438750,
          "costs": 500000,
          "netCashFlow": -61250,
          "cumulativeCashFlow": -375000
        },
        {
          "year": 3,
          "revenue": 3243216,
          "costs": 500000,
          "netCashFlow": 2743216,
          "cumulativeCashFlow": 2368216
        },
        {
          "year": 4,
          "revenue": 3556952,
          "costs": 528125,
          "netCashFlow": 3028827,
          "cumulativeCashFlow": 5397044
        },
        {
          "year": 5,
          "revenue": 19828804,
          "costs": 2832813,
          "netCashFlow": 16995991,
          "cumulativeCashFlow": 22393035
        },
        {
          "year": 6,
          "revenue": 30873671,
          "costs": 6243750,
          "netCashFlow": 24629921,
          "cumulativeCashFlow": 47022956
        },
        {
          "year": 7,
          "revenue": 28485180,
          "costs": 8415625,
          "netCashFlow": 20069555,
          "cumulativeCashFlow": 67092511
        },
        {
          "year": 8,
          "revenue": 13718687,
          "costs": 7979688,
          "netCashFlow": 5738999,
          "cumulativeCashFlow": 72831510
        },
        {
          "year": 9,
          "revenue": 11655000,
          "costs": 7812500,
          "netCashFlow": 3842500,
          "cumulativeCashFlow": 76674010
        },
        {
          "year": 10,
          "revenue": 11574000,
          "costs": 7812500,
          "netCashFlow": 3761500,
          "cumulativeCashFlow": 80435510
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
      "tenYearCosts": 171321424,
      "tenYearNetCashFlow": 204497624,
      "capitalRequirement": -112527801,
      "peakDrawdownAbs": 112527801,
      "payback": "Year 5",
      "netMargin": 0.5441385291359686,
      "recommended": false,
      "projections": [
        {
          "year": 1,
          "revenue": 0,
          "costs": 0,
          "netCashFlow": 0,
          "cumulativeCashFlow": 0
        },
        {
          "year": 2,
          "revenue": 9828000,
          "costs": 982800,
          "netCashFlow": 8845200,
          "cumulativeCashFlow": 8845200
        },
        {
          "year": 3,
          "revenue": 10319400,
          "costs": 68247289,
          "netCashFlow": -57927889,
          "cumulativeCashFlow": -49082689
        },
        {
          "year": 4,
          "revenue": 11116620,
          "costs": 74561733,
          "netCashFlow": -63445113,
          "cumulativeCashFlow": -112527801
        },
        {
          "year": 5,
          "revenue": 200524485,
          "costs": 16831811,
          "netCashFlow": 183692674,
          "cumulativeCashFlow": 71164873
        },
        {
          "year": 6,
          "revenue": 71498622,
          "costs": 3444600,
          "netCashFlow": 68054023,
          "cumulativeCashFlow": 139218895
        },
        {
          "year": 7,
          "revenue": 29137045,
          "costs": 2913705,
          "netCashFlow": 26223341,
          "cumulativeCashFlow": 165442236
        },
        {
          "year": 8,
          "revenue": 15045460,
          "costs": 1504546,
          "netCashFlow": 13540914,
          "cumulativeCashFlow": 178983150
        },
        {
          "year": 9,
          "revenue": 13828983,
          "costs": 1382898,
          "netCashFlow": 12446085,
          "cumulativeCashFlow": 191429235
        },
        {
          "year": 10,
          "revenue": 14520432,
          "costs": 1452043,
          "netCashFlow": 13068389,
          "cumulativeCashFlow": 204497624
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
      "tenYearRevenue": 151250000,
      "tenYearCosts": 42625000,
      "tenYearNetCashFlow": 108625000,
      "capitalRequirement": 0,
      "peakDrawdownAbs": 0,
      "payback": "Cash-positive (no drawdown)",
      "netMargin": 0.7181818181818181,
      "recommended": true,
      "projections": [
        {
          "year": 1,
          "revenue": 0,
          "costs": 0,
          "netCashFlow": 0,
          "cumulativeCashFlow": 0
        },
        {
          "year": 2,
          "revenue": 0,
          "costs": 0,
          "netCashFlow": 0,
          "cumulativeCashFlow": 0
        },
        {
          "year": 3,
          "revenue": 0,
          "costs": 0,
          "netCashFlow": 0,
          "cumulativeCashFlow": 0
        },
        {
          "year": 4,
          "revenue": 281250,
          "costs": 28125,
          "netCashFlow": 253125,
          "cumulativeCashFlow": 253125
        },
        {
          "year": 5,
          "revenue": 22187500,
          "costs": 2923438,
          "netCashFlow": 19264063,
          "cumulativeCashFlow": 19517188
        },
        {
          "year": 6,
          "revenue": 48500000,
          "costs": 7806250,
          "netCashFlow": 40693750,
          "cumulativeCashFlow": 60210938
        },
        {
          "year": 7,
          "revenue": 42812500,
          "costs": 9575000,
          "netCashFlow": 33237500,
          "cumulativeCashFlow": 93448438
        },
        {
          "year": 8,
          "revenue": 14968750,
          "costs": 7667188,
          "netCashFlow": 7301563,
          "cumulativeCashFlow": 100750000
        },
        {
          "year": 9,
          "revenue": 11250000,
          "costs": 7312500,
          "netCashFlow": 3937500,
          "cumulativeCashFlow": 104687500
        },
        {
          "year": 10,
          "revenue": 11250000,
          "costs": 7312500,
          "netCashFlow": 3937500,
          "cumulativeCashFlow": 108625000
        }
      ]
    }
  ]
}
