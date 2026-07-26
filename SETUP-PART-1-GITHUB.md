export type Project = {
  slug: string
  index: string
  name: string
  category: string
  blurb: string
  metric: string
  metricLabel: string
  stack: string[]
  images: { a: string; b: string; tall: string }
  caseStudy: {
    problem: string
    before: string
    built: string
    how: string
    result: string
    next: string
  }
}

/**
 * NOTE ON IMAGES: every screenshot must be taken from a version of the tool
 * running on SAMPLE / SYNTHETIC data. No real SM Beauty account names,
 * revenue figures, or customer records in anything published here.
 * Drop replacements into /public/projects/ with the same filenames.
 */
export const projects: Project[] = [
  {
    slug: 'sleeper-account-report',
    index: '01',
    name: 'Sleeper Account Report',
    category: 'BI Tool · SM Beauty',
    blurb:
      'Auto-generated weekly call list surfacing dormant accounts approaching 180-day reorder gaps, giving sales a live view into reorder timing.',
    metric: '$40K+',
    metricLabel: 'recovered revenue',
    stack: ['Power BI', 'Power Query', 'SQL', 'ERP data'],
    images: {
      a: '/projects/sleeper-1.svg',
      b: '/projects/sleeper-2.svg',
      tall: '/projects/sleeper-3.svg',
    },
    caseStudy: {
      problem:
        'Accounts were going quiet and nobody noticed until the revenue was already gone. There was no systematic way to tell the difference between a customer who was simply between orders and one who had drifted to a competitor.',
      before:
        'Sales worked from memory and from whichever accounts happened to come up in conversation. Reorder history lived in the ERP, but pulling it meant a manual export and an afternoon of spreadsheet work — so in practice, nobody pulled it.',
      built:
        'A Power BI report that scores every account against its own historical reorder cadence and surfaces the ones approaching a 180-day gap, refreshed weekly into a ranked call list the sales team opens on Monday morning.',
      how: 'Power Query pulls order history from the ERP, calculates each account’s median days-between-orders, and compares that to days-since-last-order. Accounts crossing their own threshold get flagged and ranked by historical value, so the highest-revenue lapses sit at the top of the list.',
      result:
        'Tied to over $40,000 in recovered revenue from accounts that had gone dormant and were reactivated after landing on the call list.',
      next:
        'Adding a predicted-churn score so accounts get flagged before they cross the gap rather than after.',
    },
  },
  {
    slug: 'salesman-route-generator',
    index: '02',
    name: 'Salesman Route Generator',
    category: 'Automation · SM Beauty',
    blurb:
      'Lead-quality scoring combined with Google Maps routing to build optimized daily sales routes.',
    metric: '< 10 min',
    metricLabel: 'route planning time',
    stack: ['Python', 'Google Maps API', 'Google Sheets'],
    images: {
      a: '/projects/route-1.svg',
      b: '/projects/route-2.svg',
      tall: '/projects/route-3.svg',
    },
    caseStudy: {
      problem:
        'Building a day of sales calls meant cross-referencing a lead list against a map by hand. It took over an hour, and the resulting route was rarely efficient.',
      before:
        'A rep would pick accounts off a spreadsheet, look each one up individually, and sequence the day by intuition — often driving past a good lead to reach one they had already decided on.',
      built:
        'A Python tool that scores leads on quality signals, filters to a target geography, and hands the shortlist to the Google Maps API to return an optimized driving order.',
      how: 'Leads are pulled from Sheets, scored on order history and category fit, then clustered geographically. The scored shortlist goes to the Maps Directions API with waypoint optimization enabled; the result writes back to Sheets as an ordered, linkable route.',
      result:
        'Route planning went from over an hour to under ten minutes, and the routes cover more qualified accounts per day.',
      next:
        'Turning this into a standalone app so other small sales teams can use it — see the Interests section.',
    },
  },
  {
    slug: 'backorder-merge-tool',
    index: '03',
    name: 'Backorder Merge Tool',
    category: 'In Development · SM Beauty',
    blurb:
      'Unifies the ERP backorder log with manual tracking into a single view that estimates lost revenue per account and flags reorder risk early.',
    metric: '2 → 1',
    metricLabel: 'sources of truth',
    stack: ['Power BI', 'Power Query', 'ERP integration'],
    images: {
      a: '/projects/backorder-1.svg',
      b: '/projects/backorder-2.svg',
      tall: '/projects/backorder-3.svg',
    },
    caseStudy: {
      problem:
        'Backorders were tracked in two places that disagreed with each other: the ERP’s own log, and a manual sheet the team kept because the ERP log did not capture everything they needed.',
      before:
        'Answering "how much revenue are we sitting on in backorder?" required reconciling both sources by hand, and the answer changed depending on who you asked.',
      built:
        'A Power BI model that merges both sources, deduplicates overlapping entries, and produces one backorder view with estimated lost revenue per account.',
      how: 'Power Query normalizes both feeds to a shared schema, matches on order and SKU keys, and flags conflicts for review rather than silently picking a winner. The model then joins to account revenue history to estimate exposure.',
      result:
        'In development. Currently replacing the reconciliation step entirely and giving one number the whole team works from.',
      next:
        'Early-warning flags for accounts whose backorder exposure is rising faster than their reorder cadence can absorb.',
    },
  },
]
