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
 * NOTE ON SNIPPETS AND DECISIONS:
 *   01 Sleeper Account Report — VERIFIED. Tier ladder and transition
 *      classifier transcribed from the workbook's own M, column names
 *      shortened. The earlier draft claimed a median-cadence threshold; the
 *      real model uses a fixed 180-day flag plus the tier ladder, and has
 *      been corrected.
 *   02 Salesman Route Generator — VERIFIED. Scoring rubric and bands are the
 *      real ones, with column names shortened. The earlier draft invented a
 *      Python decay function that does not exist.
 *   03 Backorder Merge Tool — UNVERIFIED. Still drafted from description
 *      alone. Read it and make it true before publishing, or remove it.
 *
 * Publishing technical detail that does not match the work is worse than
 * publishing none: it is exactly the thing an interviewer will ask you to
 * walk through.
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
      title: 'Two snapshots, not one',
      body: "A dormancy report that only looks at today can tell you an account is quiet. It cannot tell you whether that is new, or whether the account you called last quarter came back. So the report holds a frozen baseline snapshot alongside a refreshed one and classifies every account by the transition between them — Active/Healthy → Sleeper, Sleeper → Active/Healthy, Still Sleeping. The output is movement rather than state, which is what makes it possible to prove the call list worked. Sleepers are then laddered into five recoverability tiers by years since last invoice, because a two-year lapse and a six-year lapse are not the same sales problem and should not sit on the same list.",
    },
    snippet: {
      lang: 'powerquery',
      label: 'Recoverability tiers and the transition classifier',
      code: `AddSleeperTier = Table.AddColumn(Reordered, "SleeperTier_RF", each
    if [DaysSinceLastInv_RF] = null then "Never Ordered"
    else if [DaysSinceLastInv_RF] <=  730 then "Tier 1: 1-2 yrs (Most Recoverable)"
    else if [DaysSinceLastInv_RF] <= 1095 then "Tier 2: 2-3 yrs"
    else if [DaysSinceLastInv_RF] <= 1460 then "Tier 3: 3-4 yrs"
    else if [DaysSinceLastInv_RF] <= 1825 then "Tier 4: 4-5 yrs"
    else "Tier 5: 5+ yrs (Likely Lost)", type text),

// The point of the report: not what an account is, but what it did.
AddChangeCategory = Table.AddColumn(AddStatusChange, "Change Category", each
    if      [Flag_Baseline] = null      then "New Account"
    else if [Flag_Refresh]  = null      then "Account Dropped"
    else if [Flag_Baseline] = "Sleeper"        and [Flag_Refresh] = "Active/Healthy"
         then "Sleeper -> Active/Healthy"      // the recovery we are hunting
    else if [Flag_Baseline] = "Active/Healthy" and [Flag_Refresh] = "Sleeper"
         then "Active/Healthy -> Sleeper"      // the leak we want caught early
    else if [Flag_Baseline] = "Sleeper"        and [Flag_Refresh] = "Sleeper"
         then "Still Sleeping"
    else "Other", type text)`,
    },
    caseStudy: {
      problem:
        'Accounts were going quiet and nobody noticed until the revenue was already gone. There was no systematic way to tell the difference between a customer who was simply between orders and one who had drifted to a competitor.',
      before:
        'Sales worked from memory and from whichever accounts happened to come up in conversation. Reorder history lived in the ERP, but pulling it meant a manual export and an afternoon of spreadsheet work — so in practice, nobody pulled it.',
      built:
        'A Power Query model that holds a frozen baseline snapshot against a refreshed one, flags any account more than 180 days past its last invoice, ladders those into five recoverability tiers, and classifies every account by how it moved between the two snapshots.',
      how: 'Both snapshots are normalised to a shared schema and joined on account number. Days since last invoice drives the sleeper flag and the tier ladder; comparing the flag across the two snapshots produces the transition categories — Sleeper to Active/Healthy, Active/Healthy to Sleeper, Still Sleeping — which is what turns a dormancy list into evidence that calling the list worked.',
      result:
        'Tied to over $40,000 in recovered revenue from accounts that had gone dormant and were reactivated after landing on the call list.',
      next:
        'The baseline snapshot is pinned to a fixed date and has now aged past the point where the comparison is meaningful — it needs re-cutting, and the fix is to derive the baseline on a rolling window rather than hard-code it. Beyond that, a predicted-churn score so accounts get flagged before they cross the gap rather than after.',
    },
  },
  {
    slug: 'salesman-route-generator',
    index: '02',
    name: 'Salesman Route Generator',
    category: 'Automation · SM Beauty',
    blurb:
      'Scores every lead on a six-signal rubric, bands them hot to cold, and publishes those bands as map layers the field team can plan a day around.',
    metric: '< 10 min',
    metricLabel: 'route planning time',
    stack: ['Power Query', 'Python', 'Google Maps API', 'Google Sheets'],
    images: {
      a: '/projects/route-1.svg',
      b: '/projects/route-2.svg',
      tall: '/projects/route-3.svg',
    },
    decision: {
      title: 'A rubric a salesperson can argue with',
      body: "Lead scoring only works if the person holding the call list believes it. A model that outputs 0.83 with no explanation gets quietly ignored by the rep who thinks they know better — and often they do. So the score is six plain signals added together: what happened on the last call, whether they expressed interest, whether there is a named contact on file, how recently they ordered, which recoverability tier they sit in, and what they historically spend per order. Every score can be read back as a sentence, which is what makes a rep act on it. One override sits outside the arithmetic: a call logged as store closed subtracts ten, which is enough to sink any account to Cold no matter how good its history looks. That is deliberate — no amount of past revenue makes a closed store worth a drive. Publishing the bands as separate map layers rather than one ranked list follows the same logic: a rep planning a day thinks in geography first, so the score has to reach them in the shape they already work in.",
    },
    snippet: {
      lang: 'powerquery',
      label: 'Lead quality score and banding',
      code: `LeadQualityScore = Table.AddColumn(Source, "LeadQualityScore", each let
    result     = if [CallResult] = null then "" else Text.Lower([CallResult]),
    interested = if [Interested] = null then "" else [Interested],

    // What actually happened on the last contact.
    ContactSignal =
        (if Text.Contains(result, "placed order")       then  3 else 0) +
        (if Text.Contains(result, "requested salesman") then  3 else 0) +
        (if Text.Contains(result, "catalog sent")       then  2 else 0) +
        (if Text.Contains(result, "voicemail")          then  1 else 0) +
        (if Text.Contains(result, "store closed")       then -10 else 0),

    HasSignal = ContactSignal > 0,

    // Stated interest, weighted up when a real action backs it.
    InterestScore =
        if      interested = "Negative" then -1
        else if interested = "Neutral"  then  1
        else if interested = "Positive" and HasSignal then 3
        else if interested = "Positive" then  2
        else 0,

    HasContact = if [ContactPerson] = null then 0 else 1,

    RecencyScore =
        if      [DaysSinceLastInvoice] = null then 0
        else if [DaysSinceLastInvoice] <= 365 then 2
        else if [DaysSinceLastInvoice] <= 730 then 1
        else 0,

    TierScore =
        if      Text.Contains(tier, "Tier 1") then 3
        else if Text.Contains(tier, "Tier 2") then 2
        else if Text.Contains(tier, "Tier 3") then 1
        else 0,

    ValueScore =
        if      [AvgOrderAmount] = null  then 0
        else if [AvgOrderAmount] > 500   then 2
        else if [AvgOrderAmount] > 200   then 1
        else 0
in
    ContactSignal + InterestScore + HasContact
    + RecencyScore + TierScore + ValueScore),

Band = Table.AddColumn(LeadQualityScore, "LeadQualityBand", each
    if      [LeadQualityScore] >= 9 then "Hot"
    else if [LeadQualityScore] >= 6 then "Warm"
    else if [LeadQualityScore] >= 3 then "Cool"
    else "Cold")`,
    },
    caseStudy: {
      problem:
        'Building a day of sales calls meant cross-referencing a lead list against a map by hand. It took over an hour, and the resulting route was rarely efficient.',
      before:
        'A rep would pick accounts off a spreadsheet, look each one up individually, and sequence the day by intuition — often driving past a good lead to reach one they had already decided on.',
      built:
        'Two halves. Power Query scores every account on a six-signal rubric and sorts it into hot, warm, cool and cold bands. A Python step then pulls lead data through the Google API and writes each band out as its own KML layer, so the map opens with lead quality already colour-coded by geography.',
      how: 'The scoring runs entirely in Power Query against the call log, ERP account data and the sleeper tiers — contact result, stated interest, whether a named contact exists, recency, tier, and average order value, summed and banded at 9, 6 and 3. Each band becomes its own KML layer, so a salesperson opens the map, sees where the hot accounts cluster, and builds the day around them rather than reading down a list.',
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
