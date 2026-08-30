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
  /** Optional screen recordings. Same slot as the still; the still is the
   *  poster frame and the fallback, so these can be added one at a time. */
  videos?: { a?: string; b?: string; tall?: string }
  /** The judgement call. Not what was built — why it was built that way,
   *  and what the obvious alternative would have got wrong. */
  decision: { title: string; body: string }
  /** One short, sanitised extract. Never production code. */
  snippet: { lang: string; label: string; code: string }
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
 *
 * NOTE ON SNIPPETS AND DECISIONS: the `snippet` and `decision` fields were
 * drafted from written descriptions of each tool, not lifted from the real
 * implementations. Before publishing, read each one and make it true — the
 * technique, the thresholds, the reasoning. Where a draft differs from what
 * was actually built, replace it. Publishing technical detail that does not
 * match the work is worse than publishing none, because it is exactly the
 * thing an interviewer will ask you to walk through.
 *
 * Keep every snippet sanitised: generic table and column names, no real
 * schema, no live thresholds. The technique is yours to show; the employer's
 * data model is not.
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
    decision: {
      title: 'Each account is judged against its own rhythm',
      body: "A fixed 180-day rule would have been simpler, but it treats a salon that reorders monthly the same as a distributor that reorders twice a year — the first is in trouble at 60 days and the second is fine at 150. So the threshold is relative: every account is scored against its own historical cadence. I used the median gap between orders rather than the mean, because a handful of bulk restocks pulled the average out far enough that genuinely lapsed accounts still looked healthy.",
    },
    snippet: {
      lang: 'sql',
      label: 'Scoring an account against its own cadence',
      code: `WITH gaps AS (
    SELECT
        account_id,
        order_date,
        DATEDIFF(day,
            LAG(order_date) OVER (
                PARTITION BY account_id ORDER BY order_date),
            order_date) AS days_since_prior
    FROM fact_orders
),
cadence AS (
    SELECT
        account_id,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY days_since_prior)
            AS median_gap,
        MAX(order_date) AS last_order
    FROM gaps
    WHERE days_since_prior IS NOT NULL
    GROUP BY account_id
)
SELECT
    account_id,
    median_gap,
    DATEDIFF(day, last_order, GETDATE()) AS days_quiet,
    DATEDIFF(day, last_order, GETDATE())
        / NULLIF(median_gap, 0) AS lapse_ratio
FROM cadence
WHERE DATEDIFF(day, last_order, GETDATE()) > median_gap * 1.5
ORDER BY lapse_ratio DESC;`,
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
    decision: {
      title: 'Score first, route second',
      body: "The intuitive order is to route everything and then trim, but that undoes the optimisation — pull four stops out of an optimised loop and what's left is no longer an efficient path. So the shortlist is fixed before the Maps API ever sees it: leads are scored, cut to the number of stops that fit in a working day, and only then handed over for sequencing. This also keeps the request under the Directions API's waypoint ceiling, which a full lead list would blow straight past.",
    },
    snippet: {
      lang: 'python',
      label: 'Lead scoring, then waypoint optimisation',
      code: `def score(lead: dict) -> float:
    # Recency decays over roughly a quarter.
    recency = math.exp(-lead["days_since_order"] / 90)
    # log1p damps the whales so one large account
    # cannot dominate the entire day's route.
    value = math.log1p(lead["trailing_12mo_revenue"]) / MAX_LOG_REV
    fit = CATEGORY_WEIGHTS.get(lead["category"], 0.5)
    return 0.50 * recency + 0.35 * value + 0.15 * fit


shortlist = sorted(leads, key=score, reverse=True)[:MAX_STOPS]

route = gmaps.directions(
    origin=depot,
    destination=depot,
    waypoints=[lead["address"] for lead in shortlist],
    optimize_waypoints=True,
    departure_time=datetime.now(),
)`,
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
    decision: {
      title: 'Surface the disagreements instead of resolving them',
      body: "It would have been easy to pick a winner — trust the ERP, overwrite the manual sheet, ship one clean number. I didn't, because the disagreement was the finding. Every row where the two sources differ marks a case the ERP log structurally fails to capture, which is exactly why the manual sheet existed in the first place. Auto-resolving would have produced a tidy report and quietly buried the process problem underneath it. The conflicts get flagged for review, and the pattern in them is what tells us what to fix upstream.",
    },
    snippet: {
      lang: 'powerquery',
      label: 'Merging two sources without picking a winner',
      code: `let
    Erp = Table.SelectColumns(ErpBackorders,
            {"OrderKey", "Sku", "QtyOpen", "DueDate"}),

    Manual = Table.SelectColumns(ManualLog,
            {"OrderKey", "Sku", "QtyOpen", "DueDate"}),

    // FullOuter, not Left. A left join silently drops the rows
    // the manual sheet caught and the ERP missed — which is the
    // whole reason the manual sheet exists.
    Joined = Table.NestedJoin(
            Erp,    {"OrderKey", "Sku"},
            Manual, {"OrderKey", "Sku"},
            "ManualRow", JoinKind.FullOuter),

    Expanded = Table.ExpandTableColumn(Joined, "ManualRow",
            {"QtyOpen", "DueDate"},
            {"Manual.QtyOpen", "Manual.DueDate"}),

    Flagged = Table.AddColumn(Expanded, "Conflict", each
            [QtyOpen] <> null
            and [Manual.QtyOpen] <> null
            and [QtyOpen] <> [Manual.QtyOpen])
in
    Flagged`,
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
