export type Snippet = { lang: string; label: string; code: string }

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
  /** Optional, and plural. Omitted where the source has not been read — an
   *  entry with no snippet is honest; one with an invented snippet is not. */
  snippets?: Snippet[]
  /** 'work' fills the Selected work stack; 'personal' lives at /personal. */
  kind?: 'work' | 'personal'
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
 * VOICE: first person, short sentences, concrete verbs. Say what I did and
 * what it cost. No portfolio throat-clearing, no "leveraged", no sentence
 * that would embarrass me read aloud in an interview.
 *
 * NOTE ON IMAGES: every screenshot must come from a version of the tool
 * running on SAMPLE / SYNTHETIC data. No real SM Beauty account names,
 * revenue figures, or customer records. Drop replacements into
 * /public/projects/ with the same filenames.
 *
 * SOURCING:
 *   01 Sales Activity Tracker — VERIFIED. Code and figures come from the
 *      project's own technical write-up, which cites file and function names
 *      and tags its own inferences, plus the tier analysis run directly
 *      against the workbooks. Two things deliberately NOT claimed: that it
 *      is fully rolled out (it is in pilot), and that the week plan routes
 *      to Google Maps (the write-up has a My Maps export marked in-progress
 *      and nothing about routing). Add the latter once there is a source.
 *   02 Brand Performance Dashboard — VERIFIED. Read out of the live semantic
 *      model over XMLA; two figures additionally confirmed by executing DAX
 *      against it. Table and column names are GENERALISED on purpose — the
 *      schema is the employer's, the technique is mine. Do not "make it
 *      concrete" by restoring real names, and never publish a dollar figure,
 *      a per-unit price, the brand name, an account, the host or the database.
 *   03 Salesman Route Generator — VERIFIED. Scoring rubric and bands are the
 *      real ones from the workbook's M, column names shortened.
 *   04 Backorder Merge Tool — UNVERIFIED. Drafted from description alone.
 *      Make it true before publishing, or cut it.
 *   P1 Landlord Ops — written from the project's README only, no inference.
 *      Carries no snippet on purpose: the source has not been read.
 *
 * Publishing detail that does not match the work is worse than publishing
 * none. It is the thing an interviewer asks you to walk through.
 * Keep snippets sanitised: generic table and column names, no live schema.
 */
export const projects: Project[] = [
  {
    kind: 'work',
    slug: 'sales-activity-tracker',
    index: '01',
    name: 'Sales Activity Tracker',
    category: 'Web App · SM Beauty',
    blurb:
      'Finds the accounts falling off a rep’s route — near collection, overdue to reorder — and builds the week around them. We have no CRM, so I built one.',
    metric: '23×',
    metricLabel: 'Tier 1 vs Tier 5 recovery',
    stack: ['Apps Script', 'JavaScript', 'Python', 'MySQL', 'Google Sheets'],
    images: {
      a: '/projects/sleeper-1.svg',
      b: '/projects/sleeper-2.svg',
      tall: '/projects/sleeper-3.svg',
    },
    decision: {
      title: 'I shipped a bug on purpose',
      body: "I ported the follow-up rules out of the team's live workbook and found one of them broken. The call-log formula looks for “catalog sent”; the dropdown only ever writes “Catalog/Sales Flyer sent”. That branch had never fired — I proved it against the sheet's own cached dates, which matched the fallback rules instead. Every instinct says fix it. I shipped it broken behind a flag, with both paths tested. Fixing it moves the follow-up date on thousands of rows the morning it goes live, and that is a call about a sales team's workload, not a code cleanup. Not mine to make by tidying. Same reason `roundHalfUp_` exists: Sheets, Python and JavaScript all round 80.5 differently, and matching the spreadsheet was the requirement.",
    },
    snippets: [
      {
        lang: 'powerquery',
        label: 'Ranking dormant accounts by how recoverable they are',
        code: `AddSleeperTier = Table.AddColumn(Reordered, "SleeperTier_RF", each
    if [DaysSinceLastInv_RF] = null then "Never Ordered"
    else if [DaysSinceLastInv_RF] <=  730 then "Tier 1: 1-2 yrs (Most Recoverable)"
    else if [DaysSinceLastInv_RF] <= 1095 then "Tier 2: 2-3 yrs"
    else if [DaysSinceLastInv_RF] <= 1460 then "Tier 3: 3-4 yrs"
    else if [DaysSinceLastInv_RF] <= 1825 then "Tier 4: 4-5 yrs"
    else "Tier 5: 5+ yrs (Likely Lost)", type text),

// The point isn't what an account IS. It's what it did between snapshots.
AddChangeCategory = Table.AddColumn(AddStatusChange, "Change Category", each
    if      [Flag_Baseline] = "Sleeper"        and [Flag_Refresh] = "Active/Healthy"
         then "Sleeper -> Active/Healthy"      // the win
    else if [Flag_Baseline] = "Active/Healthy" and [Flag_Refresh] = "Sleeper"
         then "Active/Healthy -> Sleeper"      // the leak
    else if [Flag_Baseline] = "Sleeper"        and [Flag_Refresh] = "Sleeper"
         then "Still Sleeping"
    else "Other", type text)`,
      },
      {
        lang: 'javascript',
        label: 'The preserved branch, and the flag that governs it',
        code: `// Never fires as shipped. Verified against the sheet's own cached
// follow-up dates. Turning it on is a Sales decision, not mine.
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

  var ov = CALL_STATUS_OVERRIDE[callStatus];      // voicemail 14, no answer 3
  if (ov != null) return { date: addDays_(d, ov), reason: 'status +' + ov + 'd' };

  var days = CALL_INTEREST_DAYS[interested];      // pos 7, neutral 30, neg stop
  return days == null
    ? { date: null, reason: 'no rule matched' }
    : { date: addDays_(d, days), reason: 'interest +' + days + 'd' };
}`,
      },
    ],
    caseStudy: {
      problem:
        'Thirteen reps, about four thousand accounts, no CRM. Everyone kept their own workbook, so nobody could answer the three questions that came up every week: who is close to collection, who is overdue to reorder, and who did I promise to call back. Accounts that fell outside a rep’s usual route went quiet and nobody noticed until the revenue was gone.',
      before:
        'Three versions of the same idea, each one hitting a wall. I started in Excel, pulling account history out of the ERP — good for analysis, useless as shared infrastructure. One file, one laptop. So I moved it to a Google Sheets call log, which fixed collaboration and created a new problem: fifteen people typing into one grid with no validation, no derived dates, and no way for a manager to see anything without scrolling somebody else’s rows.',
      built:
        'An Apps Script web app over one Sheets workbook. I scripted the nightly ERP pull in Python — it queries MySQL for each account’s first and last invoice, average order value, average days between orders, balance and aging, then writes one tab through a service account. The app derives every follow-up date from the team’s own result vocabulary, flags accounts by payment terms against last invoice date for collections, uses reorder cadence to surface accounts with no logged activity at all, and precomputes the week’s visit list. Managers get a nightly roll-up instead of asking someone for their file. In pilot, not fully rolled out.',
      how: 'The browser never touches the sheet — everything goes through google.script.run, and the app runs as its owner so reps need no edit rights. I wrote the rule engine twice on purpose: engine.py is the spec, RuleEngine.gs is the port, and a suite diffs them across 3,733 cases with SpreadsheetApp stubbed as a proxy that throws, so any rule reaching for the spreadsheet fails loudly. Apps Script’s six-minute ceiling shaped everything — one plan pass reads about 140,000 cells, fine nightly and impossible per click — so the scan moved off the request path into a precomputed tab behind a three-tier cache.',
      result:
        'The tier model earned its place. Tier 1 accounts came back at 16.4%, Tier 5 at 0.7% — 23× — and the top two tiers produced 93% of returning revenue from 39% of the dormant pool. That is the finding: dormancy length predicts recoverability well enough to sort on. One cycle put $77,879 back on the books from accounts where a rep logged a call and an order followed; with no holdout group that is an association, not proof, and I say so. On the build side, 4,600 automated checks across five suites, and the log’s first 23 columns are pinned to the legacy layout so nothing already built on it broke.',
      next:
        'A holdout group, randomised within each tier, so the next cycle measures the calling instead of correlating with it. A lead score to rank within a bucket — rebuilt, not ported: the old one blended account value with account warmth into one number, which kills the only distinction that matters when you are deciding where to drive. And a nightly map export so a director can see where the hot accounts cluster; that one is designed and not built.',
    },
  },
  {
    kind: 'work',
    slug: 'brand-performance-dashboard',
    index: '02',
    name: 'Brand Performance Dashboard',
    category: 'Power BI · SM Beauty',
    blurb:
      'Revenue and units by brand, region and month, off a semantic model I built on hand-written SQL. It caught a brand whose units were up while its revenue fell.',
    metric: '99.6%',
    metricLabel: 'of backordered units priced',
    stack: ['Power BI', 'DAX', 'SQL', 'MySQL', 'Power Query'],
    images: {
      a: '/projects/route-1.svg',
      b: '/projects/route-2.svg',
      tall: '/projects/route-3.svg',
    },
    decision: {
      title: 'The card went blank when anyone picked two months',
      body: "I wrote the first comparison measures with SELECTEDVALUE, which returns blank unless exactly one value is in context. So the moment a director selected two months on the slicer — the normal way people use a slicer — the card emptied. It did not look wrong. It looked like no data, which is worse, because nobody reports a card that seems to have nothing to show. I rebuilt it to read whatever grid of years and months is actually selected, turn each pair into a single integer of Year × 12 + Month, shift the whole set back one, and sum the pieces. Because that index runs continuously across year boundaries, January rolling back to the prior December is arithmetic — there is no IF for year rollover, because none is needed. A five-month selection now compares against the five months before it. Two smaller calls: it returns a formatted string with a direction arrow instead of a number, because it lives on a card where the sign has to read at a glance, and when a comparison is impossible it says so in words. Blank is the failure mode that gets misread as zero.",
    },
    snippets: [
      {
        lang: 'sql',
        label: 'Deriving a region the ERP does not have',
        code: `SELECT
    CASE
        WHEN a.account_no IS NULL                       THEN 'Unclassified'
        WHEN LEFT(a.account_no,2) = 'HQ'                THEN 'Internal'
        WHEN LEFT(a.account_no,2) IN ('IW','IC')        THEN 'International'
        WHEN LEFT(a.account_no,2) REGEXP '^[A-Z][A-Z]$' THEN LEFT(a.account_no,2)
        ELSE 'Unclassified'
    END                                                 AS Region,
    b.brand_id, b.brand_name,
    YEAR(l.created_on)                                  AS Year,
    MONTH(l.created_on)                                 AS MonthSort,
    SUM(COALESCE(l.extended_amount,
                 l.unit_price * l.qty_ordered))         AS Amount,
    SUM(COALESCE(l.qty_shipped, 0))                     AS Units
FROM order_line l
JOIN order_header h ON h.order_id   = l.order_id
LEFT JOIN account a ON a.account_id = h.account_id
JOIN product p      ON p.product_id = l.product_id
JOIN brand   b      ON b.brand_id   = p.brand_id
WHERE COALESCE(l.is_deleted, 0) = 0        -- soft-deleted rows
  AND COALESCE(b.is_deleted, 0) = 0
  AND h.order_status = STATUS_POSTED       -- posted orders only
  AND (l.extended_amount IS NOT NULL       -- or enough to rebuild it
       OR (l.unit_price > 0 AND l.qty_ordered > 0))
GROUP BY Region, b.brand_id, b.brand_name, Year, MonthSort`,
      },
      {
        lang: 'dax',
        label: 'A period comparison that survives any selection',
        code: `VAR SelGrid =
    SUMMARIZE(
        CROSSJOIN(VALUES(DimYear[Year]), VALUES(DimMonth[MonthSort])),
        DimYear[Year], DimMonth[MonthSort]
    )
VAR Shifted =
    SELECTCOLUMNS(SelGrid, "@idx",
        DimYear[Year] * 12 + DimMonth[MonthSort] - 2)
VAR PriorVal =
    SUMX(
        Shifted,
        VAR y = QUOTIENT([@idx], 12)   // year rollover falls out of the
        VAR m = MOD([@idx], 12) + 1    // arithmetic, not an IF
        RETURN
            CALCULATE(
                [Revenue],
                REMOVEFILTERS(DimYear), REMOVEFILTERS(DimMonth),
                DimYear[Year] = y, DimMonth[MonthSort] = m
            )
    )
VAR Pct = DIVIDE([Revenue] - PriorVal, PriorVal)
RETURN
    SWITCH(TRUE(),
        NOT ISFILTERED(DimYear[Year]),     "Select a year",
        ISBLANK(PriorVal) || PriorVal = 0, "No prior-period data",
        Pct > 0, UNICHAR(11165) & " " & FORMAT(Pct, "0.0%"),
        Pct < 0, UNICHAR(11167) & " " & FORMAT(Pct * -1, "0.0%"),
        FORMAT(Pct, "0.0%"))`,
      },
    ],
    caseStudy: {
      problem:
        'Management wanted brand performance by month and region. Two problems: the ERP has no region column anywhere, and every comparison was being re-derived inside individual visuals, so two cards on the same page could disagree and nobody could tell which was right.',
      before:
        'Revenue questions got answered by exporting from the ERP and building the comparison by hand, one question at a time. Nothing was reusable, so the same arithmetic got rewritten every time somebody asked.',
      built:
        'A semantic model — 16 tables, 22 relationships, 92 measures — on three source types: SQL I wrote against the MySQL ERP, an Excel workbook for a process the ERP does not capture, and calculated tables defined in DAX. Five fact tables at three grains, sharing brand, year and month dimensions. The comparison logic is defined once in the model and reused, which is the part that matters; 92 measures is not the achievement, not re-deriving them per visual is.',
      how: 'Region came from a heuristic: geography is encoded in the first two characters of the account number, assigned at account creation. The regex branch takes any two-letter code, and explicit branches above it carve out the prefixes that are not geographic — internal and international — so they cannot be silently counted as a region. It drifts if a customer relocates and it cannot tell a bill-to from a ship-to, and that caveat is written on the column rather than kept in my head. Elsewhere I pivot twelve months into columns at the database, where the CASE branches are cheap and it collapses the result set roughly twelvefold before it crosses the wire, then unpivot back in Power Query where it costs nothing. The wide shape only exists in transit.',
      result:
        'The finding it is known for internally: one brand’s units were up 5.5% while revenue per unit fell 8.2% over the same seven months. Revenue was down and units were not — a customer-mix shift toward wholesale pricing tiers, not a demand problem. No revenue chart on its own shows that. It came out of splitting the year-over-year change into a volume effect and a price effect, built so the two sum to the total, which makes the decomposition checkable rather than merely plausible. Separately, a pricing ladder values backordered rows: entered price, then the account’s contracted tier price, then tier 1 list, then product average — every rung testing greater than zero, because an unconfigured tier price is stored as 0.00 and that is not a price. It covers 99.6% of backordered units, and a companion measure names the rows it could not price. An estimate is only defensible if it reports its own coverage.',
      next:
        'Three measures in here replaced earlier ones of mine that were wrong in ways that looked right — a comparison that blanked on multi-month selections, a year-over-year card with REMOVEFILTERS hardcoded so it returned the same number whichever year you picked, and a backorder valuation that priced wholesale accounts near retail. Finding those is the skill; not having written them would have been better. Next is the scenario measure: one manual data stream lapsed mid-year, so I ship a clearly-named +20% scenario beside the actual with the disclosure generated by the model rather than a text box, because a text box can be deleted or left behind when a visual is copied. The 20% is a placeholder, not a defence — evidence for the real gap ranges from −12% to +69%, so no single figure is supportable yet.',
    },
  },
  {
    kind: 'work',
    slug: 'salesman-route-generator',
    index: '03',
    name: 'Salesman Route Generator',
    category: 'Automation · SM Beauty',
    blurb:
      'Scores every lead on six plain signals, bands them hot to cold, and publishes the bands as map layers a rep can plan a day around.',
    metric: '< 10 min',
    metricLabel: 'route planning time',
    stack: ['Power Query', 'Python', 'Google Maps API', 'Google Sheets'],
    images: {
      a: '/projects/route-1.svg',
      b: '/projects/route-2.svg',
      tall: '/projects/route-3.svg',
    },
    decision: {
      title: 'A score a rep can argue with',
      body: "Lead scoring only works if the person holding the list believes it. A model that outputs 0.83 with no explanation gets ignored by the rep who thinks they know better — and often they do. So I made it six plain signals added together: what happened on the last call, whether they showed interest, whether there's a named contact, how recently they ordered, which tier they sit in, what they usually spend. Every score reads back as a sentence. One override sits outside the arithmetic — a call logged as store closed subtracts ten, enough to sink anything to Cold no matter how good the history looks. No amount of past revenue makes a shuttered store worth the drive.",
    },
    snippets: [
      {
        lang: 'powerquery',
        label: 'Lead quality score and banding',
        code: `LeadQualityScore = Table.AddColumn(Source, "LeadQualityScore", each let
    result     = if [CallResult] = null then "" else Text.Lower([CallResult]),
    interested = if [Interested] = null then "" else [Interested],

    ContactSignal =
        (if Text.Contains(result, "placed order")       then  3 else 0) +
        (if Text.Contains(result, "requested salesman") then  3 else 0) +
        (if Text.Contains(result, "catalog sent")       then  2 else 0) +
        (if Text.Contains(result, "voicemail")          then  1 else 0) +
        (if Text.Contains(result, "store closed")       then -10 else 0),

    HasSignal = ContactSignal > 0,

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
    ],
    caseStudy: {
      problem:
        'Building a day of calls meant cross-referencing a lead list against a map by hand. Over an hour, and the route was rarely efficient — a rep would drive past a good lead to reach one they had already decided on.',
      before:
        'A spreadsheet of leads and a rep’s own sense of geography. Nothing scored them, so the order of the day came down to who came to mind first.',
      built:
        'Two halves. Power Query scores every account on the six-signal rubric and sorts it into hot, warm, cool and cold. A Python step then pulls lead data through the Google API and writes each band out as its own KML layer, so the map opens with lead quality already colour-coded by geography.',
      how: 'The scoring runs entirely in Power Query against the call log, ERP account data and the sleeper tiers. Bands cut at 9, 6 and 3. Each band becomes its own map layer rather than one ranked list, because a rep planning a day thinks in geography first — the score has to arrive in the shape they already work in.',
      result:
        'Route planning dropped from over an hour to under ten minutes, and the day covers more qualified accounts.',
      next:
        'This is the scoring model the newer tracker dropped and is now rebuilding. The rebuild splits it into two numbers instead of one — what an account is worth, and how warm it is right now — because blending them hides the distinction between big-but-cold and small-but-hot.',
    },
  },
  {
    kind: 'work',
    slug: 'backorder-merge-tool',
    index: '04',
    name: 'Backorder Merge Tool',
    category: 'In Development · SM Beauty',
    blurb:
      'Two systems disagreed about what was on backorder. This merges them into one view and flags where they conflict instead of picking a winner.',
    metric: '2 → 1',
    metricLabel: 'sources of truth',
    stack: ['Power BI', 'Power Query', 'ERP integration'],
    images: {
      a: '/projects/backorder-1.svg',
      b: '/projects/backorder-2.svg',
      tall: '/projects/backorder-3.svg',
    },
    decision: {
      title: 'Surface the disagreements, don’t resolve them',
      body: "It would have been easy to pick a winner — trust the ERP, overwrite the manual sheet, ship one clean number. I didn't, because the disagreement was the finding. Every row where the two sources differ marks something the ERP log structurally fails to capture, which is exactly why the manual sheet existed. Auto-resolving would have produced a tidy report and buried the process problem underneath it. The conflicts get flagged for review, and the pattern in them tells us what to fix upstream.",
    },
    snippets: [
      {
        lang: 'powerquery',
        label: 'Merging two sources without picking a winner',
        code: `let
    Erp = Table.SelectColumns(ErpBackorders,
            {"OrderKey", "Sku", "QtyOpen", "DueDate"}),

    Manual = Table.SelectColumns(ManualLog,
            {"OrderKey", "Sku", "QtyOpen", "DueDate"}),

    // FullOuter, not Left. A left join silently drops the rows the
    // manual sheet caught and the ERP missed — the whole reason the
    // manual sheet exists.
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
    ],
    caseStudy: {
      problem:
        'Backorders lived in two places that disagreed: the ERP’s own log, and a manual sheet the team kept because the ERP log missed things.',
      before:
        '“How much revenue are we sitting on in backorder?” meant reconciling both by hand, and the answer changed depending on who you asked.',
      built:
        'A Power Query model that merges both feeds, deduplicates the overlap, and produces one backorder view with estimated exposure per account.',
      how: 'Both feeds normalise to a shared schema and match on order and SKU. Conflicts get flagged rather than resolved. The model then joins to account revenue history to estimate what is at risk.',
      result:
        'In development. It replaces the reconciliation step and gives the team one number to work from.',
      next:
        'Early-warning flags for accounts whose backorder exposure is climbing faster than their reorder cadence can absorb.',
    },
  },
  {
    kind: 'personal',
    slug: 'landlord-ops',
    index: 'P1',
    name: 'Landlord Ops',
    category: 'Personal · In progress',
    blurb:
      'Property ops for 11 buildings and 30 units. It writes down what should happen before it happens, so a bill that never arrived becomes an alert instead of an absence.',
    metric: '30',
    metricLabel: 'units, 11 buildings, 2 states',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Drizzle'],
    images: {
      a: '/projects/backorder-1.svg',
      b: '/projects/backorder-2.svg',
      tall: '/projects/backorder-3.svg',
    },
    decision: {
      title: 'Write the expectation before the record',
      body: "A filing cabinet records what happened. It can't record what didn't — a receipt never filed and a bill never paid look identical, because both are an absence of paper. So the system writes the expectation first. A scheduled job creates a row for every rent, utility bill and tax instalment that should occur, and those rows start unfulfilled. Anything still unfulfilled past its date is the alert. It also splits missing into three states, because they need different actions: due but not arrived means chase the utility before the late fee, in hand and unpaid means go pay it, money moved with no receipt means find the receipt or have no proof at tax time. A binder collapses all three into no paper. That collapse is the thing I'm fixing.",
    },
    caseStudy: {
      problem:
        'A self-managed rental portfolio across two states and four counties, run out of a binder of printed bills and stapled receipts. The binder answers what happened. It can’t answer what was missed, which is the only question that costs money.',
      before:
        'Two spreadsheets that disagreed with each other, and paper for everything else. Utilities paid through guest-pay portals organised by account number, with nothing but memory holding the mapping from an account to the units it covers.',
      built:
        'A Next.js app over Postgres with an obligation engine at the centre. A nightly job generates every expected rent, bill and tax instalment; status is derived from payments and documents rather than stored, so two parts of the interface can’t disagree about whether rent is late. Working now: the schema, the registry seeded from real portfolio data, the engine with 55 tests, the generator, an exceptions-first dashboard and the year grid.',
      how: 'The structural call was that a building is not a unit. The spreadsheets treated every rentable space as its own property, but the outside world doesn’t bill that way — one water account covers three units, one parcel covers three more. So utility accounts and tax parcels attach to the building while tenants and rent attach to the unit. Dates are plain YYYY-MM-DD strings, not Date objects, because rent due dates shouldn’t move when the server is in UTC and the properties are in Chicago. Money is Postgres numeric read as strings — floating point can’t represent ten cents, and a portfolio summing to about $470k a year visibly drifts.',
      result:
        'The generator is idempotent — unique index plus ON CONFLICT DO NOTHING — because a scheduled job that isn’t safe to re-run is a job nobody dares re-run. Conflicting source data is kept, not resolved: the two spreadsheets disagreed on the tenant for eight units, so both readings stay and the resolved field is null until a lease settles it. Unknowns are blanks, never guesses. I test the export round trip by deleting the database and restoring it, because a backup nobody has restored is a hope.',
      next:
        'Document upload, payment recording, and lease-date extraction from 858 lease documents — which is why every lease-expiry alert is currently silent. The free hosting tier it runs on is licensed for personal, non-commercial use. That covers a portfolio piece and does not cover being the books for a rental business, so moving is on the list. It’s a hosting change, not a rewrite.',
    },
  },
]
