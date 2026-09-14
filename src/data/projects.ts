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
 *   01 Sales Activity Tracker — VERIFIED against the project's own technical
 *      write-up, which cites file and function names throughout and tags its
 *      own inferences. Figures used here are the sourced ones. The build is
 *      described as in pilot because the write-up says so; do not upgrade that
 *      wording without a rollout actually happening.
 *   02 Sleeper Account Report — VERIFIED. Tier ladder and transition
 *      classifier transcribed from the workbook's own M, column names
 *      shortened. The earlier draft claimed a median-cadence threshold; the
 *      real model uses a fixed 180-day flag plus the tier ladder, and has
 *      been corrected.
 *   03 Salesman Route Generator — VERIFIED. Scoring rubric and bands are the
 *      real ones, with column names shortened. The earlier draft invented a
 *      Python decay function that does not exist.
 *   04 Backorder Merge Tool — UNVERIFIED. Still drafted from description
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
    slug: 'sales-activity-tracker',
    index: '01',
    name: 'Sales Activity Tracker',
    category: 'Web App · SM Beauty',
    blurb:
      'A logged record of every customer visit and call, turned into next week\u2019s plan. Replaces a stack of per-salesman workbooks for a ~4,000-account book.',
    metric: '4,600',
    metricLabel: 'automated checks, 5 suites',
    stack: ['Apps Script', 'JavaScript', 'Python', 'MySQL', 'Google Sheets'],
    images: {
      a: '/projects/sleeper-1.svg',
      b: '/projects/sleeper-2.svg',
      tall: '/projects/sleeper-3.svg',
    },
    decision: {
      title: 'Ship the spreadsheet\u2019s bug on purpose',
      body: "The follow-up rules were ported out of the team\u2019s live workbook, and one of them was broken. The call-log formula searches the result text for \u201ccatalog sent\u201d, but the dropdown only ever writes \u201cCatalog/Sales Flyer sent\u201d \u2014 so that branch had never fired on a single row, and every catalog call had been silently falling through to the generic interest rules instead. I proved it against the sheet\u2019s own cached values before touching anything. The engineering instinct is to fix it. I shipped it broken, behind a flag, with both paths tested. Fixing it moves the follow-up date on thousands of rows the morning it goes live, which is a decision about a sales team\u2019s workload, not a code cleanup \u2014 theirs to make, not mine to make for them by tidying. The same reasoning governs the rounding: Sheets rounds half away from zero, Python does banker\u2019s rounding, JavaScript rounds half up, and all three disagree at 80.5. Matching the spreadsheet was the requirement. Matching the language would have been the bug.",
    },
    snippet: {
      lang: 'javascript',
      label: 'The preserved branch, and the flag that governs it',
      code: `// The live formula searches for "catalog sent". The dropdown writes
// "Catalog/Sales Flyer sent". The branch has never fired in production —
// verified against the sheet's own cached follow-up dates, which match
// the fallback rules instead. Fixing it shifts thousands of dates on day
// one, so the flag defaults to reproducing the bug and both paths are
// tested. Turning it on is a Sales decision.
var CATALOG_RULE_FIXED = false;

function callFollowUp(contactDate, callStatus, interested, result, fixed) {
  var d = dateOnly_(contactDate);
  if (!d) return { date: null, reason: 'no contact date' };

  fixed = (fixed == null) ? CATALOG_RULE_FIXED : fixed;
  var r = String(result || '').toLowerCase();
  var hit = fixed
    ? (r.indexOf('catalog') >= 0 && r.indexOf('sent') >= 0)   // intended
    : (r.indexOf('catalog sent') >= 0);                       // as shipped
  if (hit) return { date: addDays_(d, 14), reason: 'catalog sent +14d' };

  var ov = CALL_STATUS_OVERRIDE[callStatus];          // voicemail 14, no answer 3
  if (ov != null) return { date: addDays_(d, ov), reason: 'status +' + ov + 'd' };

  var days = CALL_INTEREST_DAYS[interested];          // pos 7, neutral 30, neg stop
  return days == null
    ? { date: null, reason: 'no rule matched' }
    : { date: addDays_(d, days), reason: 'interest +' + days + 'd' };
}

// Sheets rounds half away from zero, Python uses banker's rounding, JS
// rounds half up. Found by the port-diff suite disagreeing on 80.5.
function roundHalfUp_(x) {
  return x >= 0 ? Math.floor(x + 0.5) : -Math.floor(-x + 0.5);
}`,
    },
    caseStudy: {
      problem:
        'Thirteen reps covering roughly four thousand accounts kept their own Excel workbooks, so there was no single record of who had been visited, what was said, or who was owed a callback. Three questions came up every week \u2014 who is due to reorder, who owes money, who did I promise to call \u2014 and answering any of them meant opening somebody else\u2019s file.',
      before:
        'A stack of per-salesman workbooks plus a shared call log, refreshed by hand. Reorder timing lived in the ERP and reached the reps only when someone exported it. Nothing connected a visit logged on Tuesday to the plan built on Friday.',
      built:
        'A single-page web app on Apps Script over one Google Sheets workbook, fed nightly from the company\u2019s MySQL ERP by a Python job. Reps log visits and calls from a phone; the app derives each follow-up date from the team\u2019s own result vocabulary, buckets it overdue through later, and precomputes next week\u2019s visit plan and a collections list. Currently in pilot rather than fully rolled out.',
      how: 'The browser never touches the sheet \u2014 every read and write crosses through google.script.run, and the app is deployed to execute as its owner so reps need no edit rights on the workbook. The rule engine is written twice on purpose: engine.py is the specification and RuleEngine.gs is the port, and a test suite diffs the two across 3,733 cases with SpreadsheetApp and Session replaced by proxies that throw, so any rule reaching for the spreadsheet fails loudly rather than passing quietly. Apps Script\u2019s six-minute execution ceiling shaped the whole design: one full plan pass reads about 140,000 cells, which is fine nightly and impossible per click, so the scan moved off the request path into a precomputed hidden tab read through a three-tier cache.',
      result:
        'Five test suites, 4,600 checks: static layout and wiring, a boot suite that loads the real page into a Node VM and drives every render path, the rule tables, the sync, and the port diff. The log\u2019s first twenty-three columns are pinned byte-for-byte to the legacy call-log layout so anything already built on it keeps working, and a test fails the build if anyone reorders them. The sync refuses to write rather than write badly \u2014 it checks row shape, blank dates, negative cadences and an aging invariant that reconciled across all 4,117 exported rows, and writes the new block before trimming the old so a failure leaves yesterday\u2019s data standing.',
      next:
        'The plan and the collections list deliberately disagree about who owns an account. The plan follows whoever logged the last activity, on the grounds that they are the one holding the relationship; collections follow the account owner on record, because the money is theirs to chase even when a colleague covered the store last week. Both are defensible and each is right for its own list \u2014 but having two ownership rules in one codebase without a written policy is how an account ends up on the wrong screen, and it already has. Next is picking one, or documenting why there are two. After that, reinstating a lead score to rank within a bucket, rebuilt rather than ported: the original blended account value and account warmth into a single number, which destroys the one distinction that actually drives a decision \u2014 big but cold is worth the drive, small but hot is worth a call. One of its six factors also read rep names where it meant store contacts, so it was always true and contributed nothing.'
    },
  },
  {
    slug: 'sleeper-account-report',
    index: '02',
    name: 'Sleeper Account Report',
    category: 'BI Tool · SM Beauty',
    blurb:
      'Ranks dormant accounts by how recoverable they are, then measures whether the ranking held. It did: Tier 1 came back 23 times more often than Tier 5.',
    metric: '23×',
    metricLabel: 'Tier 1 vs Tier 5 recovery',
    stack: ['Power BI', 'Power Query', 'SQL', 'ERP data'],
    images: {
      a: '/projects/sleeper-1.svg',
      b: '/projects/sleeper-2.svg',
      tall: '/projects/sleeper-3.svg',
    },
    decision: {
      title: 'Two snapshots, not one',
      body: "A dormancy report that only looks at today can tell you an account is quiet. It cannot tell you whether that is new, or whether the account you called last quarter came back. So the report holds a frozen baseline snapshot alongside a refreshed one and classifies every account by the transition between them — Active/Healthy → Sleeper, Sleeper → Active/Healthy, Still Sleeping. The output is movement rather than state. Sleepers are laddered into five recoverability tiers by years since last invoice, on the assumption that a two-year lapse and a six-year lapse are not the same sales problem. One cycle later the data settled it: Tier 1 accounts came back at 16.4%, Tier 5 at 0.7% — a twenty-three-fold spread, with 93% of returning revenue concentrated in the top two tiers. The ranking shipped as a hypothesis and is now measured.",
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
      how: 'Both snapshots are normalised to a shared schema and joined on account number. Days since last invoice drives the sleeper flag and the tier ladder; comparing the flag across the two snapshots produces the transition categories — Sleeper to Active/Healthy, Active/Healthy to Sleeper, Still Sleeping. That comparison is what makes the ranking testable, because it records which accounts actually moved rather than only which are quiet today. Revenue from returning accounts was $77,879 where a rep had logged a call and an order followed; with no holdout group that figure is an association, not an attribution, and is reported as such.',
      result:
        'One cycle, February to May 2026: 2,422 dormant accounts in the baseline pool, 1,557 contacted, 947 calls logged, 132 accounts returned to active. The result worth reporting is the ranking. Tier 1 returned at 16.4% against Tier 5 at 0.7% — a twenty-three-fold spread — and the top two tiers produced 93% of returning revenue from 39% of the pool. Dormancy length predicts recoverability strongly enough to sort on, which is what the model was built to test.',
      next:
        'A holdout. Reps worked the highest tiers first, so the called and uncalled groups are not comparable and the calling cannot be separated from accounts reordering on their own schedule. Next cycle randomises a control group within each tier, which turns an association into a measurement. Two model changes go with it: the 180-day flag needs to key off each account\u2019s own cadence, since 27.6% of the base naturally reorders slower than that and is being flagged while behaving normally, and the baseline needs deriving on a rolling window rather than pinned to a fixed date. The pause left 2,427 accounts dormant, 505 in the band that returned at 16.4% \u2014 a prioritised backlog rather than an open question.',
    },
  },
  {
    slug: 'salesman-route-generator',
    index: '03',
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
    index: '04',
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
