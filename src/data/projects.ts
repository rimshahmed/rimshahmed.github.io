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
  decision?: { title: string; body: string }
  /** Optional, and plural. Omitted where the source has not been read — an
   *  entry with no snippet is honest; one with an invented snippet is not. */
  snippets?: Snippet[]
  /** 'work' fills the Selected work stack. 'other' (work still in
   *  development) and 'personal' both live on the Other projects page. */
  kind?: 'work' | 'other' | 'personal'
  /** An outside thing worth opening — a live mockup, a demo. */
  link?: { label: string; href: string }
  /** Shown in place of the case study while the write-up is pending. Only
   *  what is already sourced goes here — no figures until there are real ones. */
  pending?: string
  caseStudy?: {
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
 *   04 ERP Migration Testing — STUB. Only what the role review and my own
 *      notes already state. Testing ran in a non-live copy. The linked mockups
 *      run on sample data. No figures until sourced.
 *   05 Lead Finder — VERIFIED against the code and my own system overview
 *      (Nov 2026). Snippets are from leadfinder.py and normalize.py, lightly
 *      trimmed. The account-growth figure is my own count, not an ERP query.
 *      Deliberately generic: no place names, and the priority tiers are
 *      described without saying what they are built from.
 *   O1 Backorder Merge Tool — UNVERIFIED. Moved to Other projects. Drafted from description alone.
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
      "Thirteen reps, about four thousand accounts, and no CRM. So I built one. It finds the accounts slipping off a rep’s route and plans the week around them.",
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
      body: "When I ported the follow-up rules out of the team's live workbook, I found one that had never worked. The formula looks for “catalog sent”. The dropdown only ever writes “Catalog/Sales Flyer sent”. So that branch had never fired, and I confirmed it against the sheet's own cached dates, which matched the fallback rules instead. The obvious move is to fix it. I didn't. Fixing it would move the follow-up date on thousands of rows the morning it went live, and that changes a sales team's workload. That's their call, not something I get to decide by tidying up code. So it shipped as it was, behind a flag, with both paths tested. Same reason `roundHalfUp_` exists: Sheets, Python and JavaScript each round 80.5 differently, and the requirement was to match the spreadsheet.",
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
        "Thirteen reps, about four thousand accounts, no CRM. Everyone kept their own workbook. That meant nobody could answer the three questions that came up every week: who is close to collection, who is overdue to reorder, and who did I promise to call back? Accounts outside a rep’s usual route went quiet, and nobody noticed until the revenue was gone.",
      before:
        "I tried this twice before it worked. First in Excel, pulling account history out of the ERP. Good for analysis, but it lived in one file on one laptop. Then a Google Sheets call log. That fixed sharing and created a new mess: fifteen people typing into one grid with no validation, no calculated dates, and no way for a manager to see anything without scrolling through someone else’s rows.",
      built:
        "An Apps Script web app on top of one Sheets workbook. A Python script runs every night. It queries MySQL for each account’s first and last invoice, average order value, average days between orders, balance and aging, then writes it all to one tab through a service account. The app works out every follow-up date from the words the team already uses to log calls. It flags collections by comparing payment terms to the last invoice date, uses reorder cadence to catch accounts with no logged activity at all, and builds the week’s visit list ahead of time. Managers get a nightly roll-up, so they no longer have to ask for someone’s file. It’s in pilot, not fully rolled out.",
      how: "The browser never touches the sheet. Everything goes through google.script.run, and the app runs as its owner, so reps don’t need edit rights. I wrote the rule engine twice on purpose: engine.py is the spec and RuleEngine.gs is the port. A test suite compares the two across 3,733 cases, with SpreadsheetApp swapped for a stub that throws, so any rule that reaches for the spreadsheet fails loudly. Apps Script cuts you off at six minutes, and that shaped the whole design. One planning pass reads about 140,000 cells. That’s fine overnight and impossible on a click, so the scan runs ahead of time into its own tab, behind a three-tier cache.",
      result:
        "The tiers work. Tier 1 accounts came back at 16.4% and Tier 5 at 0.7%, a 23× difference. The top two tiers brought in 93% of returning revenue from 39% of the dormant pool. So how long an account has been dormant tells you how likely it is to come back, well enough to sort a call list by. One cycle put $77,879 back on the books from accounts where a rep logged a call and an order followed. There was no holdout group, so I call that a link, not proof. On the build side: 4,600 automated checks across five suites, and the log’s first 23 columns still match the old layout, so nothing built on it broke.",
      next:
        "A holdout group, randomised within each tier, so the next cycle can measure what the calls actually did. A lead score to rank accounts inside a tier. I’m rebuilding that one, not porting it: the old score mixed what an account is worth with how warm it is, and that’s the one difference that matters when you’re deciding where to drive. And a nightly map export, so a director can see where the hot accounts cluster. That part is designed but not built.",
    },
  },
  {
    kind: 'work',
    slug: 'brand-performance-dashboard',
    index: '02',
    name: 'Brand Performance Dashboard',
    category: 'Power BI · SM Beauty',
    blurb:
      "Revenue and units by brand, region and month, on a Power BI model I built from my own SQL. It caught a brand selling more units while making less money.",
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
      body: "My first comparison measures used SELECTEDVALUE, which returns blank unless exactly one value is selected. So when a director picked two months on the slicer, which is how most people use a slicer, the card went empty. It didn't look broken. It looked like there was no data, and nobody reports a card that seems to have nothing to show. I rebuilt it to read whatever years and months are selected and turn each pair into one number: Year × 12 + Month. Shift the whole set back by one, then add up the pieces. That number runs straight across year boundaries, so January rolling back to December is just arithmetic. There's no IF for the year change because it doesn't need one. Pick five months and it compares them to the five before. Two smaller choices: it returns text with a direction arrow instead of a bare number, because it sits on a card where you need the sign at a glance. And when a comparison isn't possible, it says so in words. A blank gets read as zero.",
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
        "Management wanted brand performance by month and region. Two things stood in the way. The ERP has no region column anywhere. And every comparison was rebuilt inside each visual, so two cards on the same page could disagree with no way to tell which was right.",
      before:
        "Revenue questions were answered by exporting from the ERP and building the comparison by hand, one question at a time. Nothing carried over. The same arithmetic got rewritten every time someone asked.",
      built:
        "A semantic model with 16 tables, 22 relationships and 92 measures. It draws on three kinds of source: SQL I wrote against the MySQL ERP, an Excel workbook for a process the ERP doesn’t capture, and calculated tables in DAX. Five fact tables at three grains share the same brand, year and month dimensions. The comparison logic is written once in the model and reused everywhere. That matters more than the count of 92: no visual has to work the numbers out for itself.",
      how: "Region is a workaround. The first two characters of an account number encode geography, assigned when the account is created. My SQL accepts any two-letter code, with explicit rules above that to pull out the prefixes that aren’t places (internal and international) so they never get counted as a region. It has limits. It drifts if a customer relocates, and it can’t tell a bill-to from a ship-to. I wrote that caveat on the column itself so it doesn’t live only in my head. Elsewhere, I pivot twelve months into columns in the database, where it’s cheap and shrinks the result about twelvefold before it travels. Then I unpivot it back in Power Query, where that costs nothing. The wide shape only exists in transit.",
      result:
        "The finding people here know it for: one brand’s units were up 5.5% while revenue per unit fell 8.2% over the same seven months. Revenue was down, but demand wasn’t. Customers had shifted toward wholesale pricing tiers. A revenue chart alone would never show that. I found it by splitting the year-over-year change into a volume effect and a price effect, built so the two add up to the total. That makes it something you can check. Separately, a pricing ladder puts a value on backordered rows. It tries the entered price, then the account’s contracted tier price, then tier 1 list, then the product average. Every step checks for greater than zero, because an unconfigured tier price is stored as 0.00, and that isn’t a price. It covers 99.6% of backordered units, and a companion measure lists the rows it couldn’t price. An estimate should report its own gaps.",
      next:
        "Three measures here replaced earlier ones of mine that were wrong but looked right. A comparison that went blank on multi-month selections. A year-over-year card with REMOVEFILTERS hardcoded, so it showed the same number whichever year you picked. And a backorder valuation that priced wholesale accounts near retail. I’m glad I caught them. I’d rather not have written them. Next is a scenario measure. One manual data stream stopped mid-year, so I show a clearly named +20% scenario next to the actual. The model generates the disclosure itself, because a text box can be deleted or left behind when someone copies a visual. The 20% is a placeholder. Evidence for the real gap runs from −12% to +69%, so no single number holds up yet.",
    },
  },
  {
    kind: 'work',
    slug: 'salesman-route-generator',
    index: '03',
    name: 'Salesman Route Generator',
    category: 'Automation · SM Beauty',
    blurb:
      "Scores every lead on six plain signals, sorts them hot to cold, and puts each group on the map as its own layer. A rep can plan a day in minutes.",
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
      body: "Lead scoring only works if the rep holding the list believes it. A model that says 0.83 and explains nothing gets ignored by the rep who thinks they know better. Often they do. So the score is six plain signals added together: what happened on the last call, whether they showed interest, whether there's a named contact, how recently they ordered, which tier they're in, and what they usually spend. Every score reads back as a sentence. One rule sits outside the math. A call logged as store closed subtracts ten, which drops any account to Cold no matter how good its history looks. A closed store isn't worth the drive.",
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
        "Planning a day of calls meant checking a lead list against a map by hand. It took over an hour, and the route was rarely a good one. A rep would drive right past a strong lead to reach one they had already picked.",
      before:
        "A spreadsheet of leads and each rep’s own sense of the area. Nothing ranked the leads, so the day’s order came down to whoever came to mind first.",
      built:
        "Two parts. Power Query scores every account on the six signals and sorts it into hot, warm, cool or cold. Then a Python step pulls lead data through the Google API and writes each group out as its own KML layer. Open the map and lead quality is already colour-coded by location.",
      how: "The scoring runs entirely in Power Query, using the call log, ERP account data and the sleeper tiers. The cut-offs are 9, 6 and 3. Each group gets its own map layer, not one ranked list, because a rep planning a day thinks about geography first. The score needed to show up in the form they already work in.",
      result:
        "Route planning went from over an hour to under ten minutes, and a day now covers more qualified accounts.",
      next:
        "The newer tracker dropped this scoring model and is now rebuilding it. The new version uses two numbers: what an account is worth, and how warm it is right now. One blended number can’t tell a big cold account from a small hot one.",
    },
  },
  {
    kind: 'work',
    slug: 'erp-migration-testing',
    index: '04',
    name: 'ERP Migration Testing',
    category: 'Systems Testing · SM Beauty',
    blurb:
      "We’re moving off a legacy ERP and onto a new system on Azure. I tested it before go-live and mocked up a redesign of the whole thing, screen by screen.",
    metric: 'Pre-launch',
    metricLabel: 'tested ahead of go-live',
    stack: ['ERP Systems', 'Azure'],
    images: {
      a: '/projects/backorder-1.svg',
      b: '/projects/backorder-2.svg',
      tall: '/projects/backorder-3.svg',
    },
    link: {
      label: 'Open the redesign mockups',
      href: 'https://claude.ai/artifact/9aQ9CiCTCSkNEsyuVZGYC2',
    },
    pending:
      "The full write-up is on its way. The short version: I worked with a teammate and the developer to test the new system ahead of go-live, covering sales order placement, label generation and workflow features. All of it ran in a test copy, not the live system, so nothing I tried could touch a real order. I also mocked up a redesign of the whole system, not just one screen, so my feedback was something the developer could build from. The mockups run on sample data.",
  },
  {
    kind: 'work',
    slug: 'lead-finder',
    index: '05',
    name: 'Lead Finder',
    category: 'Python · SM Beauty',
    blurb:
      "One command pulls the stores in eight retail categories across a whole trade zone, removes the duplicates, and hands sales a map. Two runs, 1,224 requests, $0.00 in API cost.",
    metric: '$0.00',
    metricLabel: 'API cost · 1,224 requests',
    stack: ['Python', 'Google Maps API', 'SQLite', 'KML'],
    images: {
      a: '/projects/route-1.svg',
      b: '/projects/route-2.svg',
      tall: '/projects/route-3.svg',
    },
    decision: {
      title: "I threw out the filter that sounded right",
      body: "Google doesn't return fewer results when a search is thin. It pads the page with loosely related businesses nearby. One sparse category dropped from 1,622 results to 40 once the padding came out. My first fix was an include filter: keep a result only when something positively marked it as belonging. It sounded right and it didn't work. About 90% of real results carry only the generic type `store`, so there was no reliable signal to match on. So I flipped it. The filter only excludes things that are clearly wrong for the category, and everything else stays.",
    },
    snippets: [
      {
        lang: 'python',
        label: 'Only pay for a second page when the first one is full',
        code: `def search(self, query, center, radius_m, max_pages):
    """Yield raw place dicts for one query at one center."""
    body = self._body(query, center, radius_m)
    token = None
    for page in range(max_pages):
        if token:
            body = dict(body, pageToken=token)
        payload = self._post(body)          # cache first, then budget, then API
        places = payload.get("places", []) or []
        yield from places
        token = payload.get("nextPageToken")
        # Adaptive: only pay for another page if this one came back full.
        if not token or len(places) < 20:
            break

def _post(self, body):
    key = Cache.key_for(body, self.tier)
    cached = self.cache.get(key)
    if cached is not None:
        self.stats.cache_hits += 1
        return cached
    if self.stats.requests_made >= self.budget:
        raise BudgetExceeded("Run stopped before making another API call.")
    ...`,
      },
      {
        lang: 'python',
        label: 'One address form, used only to spot duplicates',
        code: `def normalize_address(address: str) -> str:
    """Canonical form used only for duplicate comparison, never for display."""
    if not address:
        return ""
    a = address.lower().split(",")[0]        # street line only
    a = a.replace("#", " ste ")              # "#4" is a unit, same as "Suite 4"
    a = re.sub(r"[^\\w\\s]", " ", a)

    tokens = []
    for raw in a.split():
        tok = _DIRECTIONS.get(raw, raw)
        tok = _STREET_TYPES.get(tok, tok)
        # Everything from the first unit marker onward is a suite inside the
        # same building, so two records that differ only there are one lead.
        if tok in _UNIT_TOKENS:
            break
        tokens.append(tok)
    return " ".join(tokens).strip()`,
      },
    ],
    caseStudy: {
      problem:
        "Finding new stores to sell to meant a manual loop: type a query, wait, export, reset, repeat. That was about 20 minutes of clicking per category, per city. Nobody can cover a territory that way.",
      before:
        "A scraping tool run by hand, one search at a time, and map layers imported and styled one by one.",
      built:
        "A Python pipeline that runs from one config file. It builds a list of search centers from every ZIP within a radius, or across a whole state, and gives each one a priority tier. It runs each retail category against each center through the Google Places API. Then it cleans up what comes back. Addresses are reduced to a standard form, duplicates are merged with the fuller record kept, and anything without a street number is dropped, because a map can't place it. Out the other end come an Excel workbook, with a sheet per category and a coverage report, and a styled KML file that imports every map layer in one step. A Google Sheets tracker sits next to it for logging follow-ups.",
      how: "Google matches business names and place types. It knows nothing about who shops there. So the targeting lives in which ZIPs get searched, not in the search words. Cost shaped the rest. Google gives 1,000 free requests a month at the tier that includes phone numbers, then charges $0.035 each. One request returns up to 20 leads with the phone attached. Sparse categories search by city, not by ZIP. A second page is only requested when the first comes back full. Before anything runs, a dry-run estimator prints the exact request count and cost. A hard budget stops the run cleanly before it can go over, and still writes out what it has. Every response is cached for 30 days. The cache paid off on day one: the first run crashed on a file-permission error after all 999 calls had finished, and the re-run cost nothing.",
      result:
        "The first run covered 131 search centers across 8 categories in 999 requests. It collected 17,930 results and came out with 4,241 unique leads. A second run across another state used 225 requests and turned 4,470 results into 412 leads. Both cost $0.00, and a run takes about six minutes with nobody watching. Around 90% of raw results were duplicates, because neighbouring search areas return the same stores. Without the address matching, the output would be unusable. In that second state, active accounts went from about 10 at the start of the year to more than 20. The reps closed those accounts. This gave them the list to work from.",
      next:
        "Turning it into a cold-call tool for the sales team. Before that, the leads need matching against our existing customer list, so reps aren't sent to stores we already sell to. The address-matching function is already the right join. It needs the customer export. There's also a Census-based version of the priority tiers that I rewrote after a failure and haven't yet confirmed against a live response.",
    },
  },
  {
    kind: 'other',
    slug: 'backorder-merge-tool',
    index: 'O1',
    name: 'Backorder Merge Tool',
    category: 'In Development · SM Beauty',
    blurb:
      "Two systems disagreed about what was on backorder. This merges them into one view and flags the conflicts. It doesn’t pick a winner.",
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
      body: "Picking a winner would have been easy. Trust the ERP, overwrite the manual sheet, ship one clean number. I didn't, because the disagreement is the useful part. Every row where the two sources differ points to something the ERP log fails to capture, and that's why the manual sheet exists in the first place. Auto-resolving would have given us a tidy report with the process problem buried under it. So conflicts get flagged for review, and the pattern in them shows what to fix upstream.",
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
        "Backorders lived in two places that disagreed: the ERP’s own log, and a manual sheet the team kept because the ERP log missed things.",
      before:
        "“How much revenue are we sitting on in backorder?” meant reconciling both by hand. The answer changed depending on who you asked.",
      built:
        "A Power Query model that merges both feeds, removes the overlap, and gives one backorder view with estimated exposure per account.",
      how: "Both feeds are reshaped to the same columns and matched on order and SKU. Conflicts are flagged, not resolved. The model then joins to account revenue history to estimate what’s at risk.",
      result:
        "Still in development. It replaces the manual reconciliation and gives the team one number to work from.",
      next:
        "Early-warning flags for accounts whose backorder exposure is growing faster than their reorder cadence can absorb.",
    },
  },
  {
    kind: 'personal',
    slug: 'landlord-ops',
    index: 'P1',
    name: 'Landlord Ops',
    category: 'Personal · In progress',
    blurb:
      "Property ops for 11 buildings and 30 units. It writes down what should happen before it happens, so a bill that never showed up triggers an alert.",
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
      body: "A filing cabinet records what happened. It can't record what didn't. A receipt never filed and a bill never paid look the same, because both are just missing paper. So the system writes the expectation first. A scheduled job creates a row for every rent payment, utility bill and tax instalment that should happen, and each row starts unfulfilled. Anything still unfulfilled past its date is the alert. It also splits “missing” three ways, because each needs a different action. Due but not arrived: chase the utility before the late fee. In hand and unpaid: go pay it. Money moved with no receipt: find the receipt, or have no proof at tax time. A binder treats all three as no paper. That's what I'm fixing.",
    },
    caseStudy: {
      problem:
        "A self-managed rental portfolio across two states and four counties, run out of a binder of printed bills and stapled receipts. The binder can tell you what happened. It can’t tell you what was missed, and that’s the question that costs money.",
      before:
        "Two spreadsheets that disagreed with each other, and paper for everything else. Utilities were paid through guest-pay portals organised by account number. Only memory connected an account to the units it covers.",
      built:
        "A Next.js app on Postgres, built around an obligation engine. A nightly job generates every expected rent, bill and tax instalment. Status is worked out from payments and documents, never stored, so two screens can’t disagree about whether rent is late. Working today: the schema, the registry seeded from real portfolio data, the engine with 55 tests, the generator, a dashboard that shows exceptions first, and the year grid.",
      how: "The big structural decision: a building is not a unit. The spreadsheets treated every rentable space as its own property, but the outside world doesn’t bill that way. One water account covers three units. One parcel covers three more. So utility accounts and tax parcels attach to the building, and tenants and rent attach to the unit. Dates are plain YYYY-MM-DD strings, not Date objects, because a rent due date shouldn’t shift when the server is in UTC and the properties are in Chicago. Money is Postgres numeric, read as strings. Floating point can’t represent ten cents, and across a portfolio of about $470k a year the drift shows.",
      result:
        "The generator is safe to run twice. A unique index plus ON CONFLICT DO NOTHING handles that, because nobody dares re-run a scheduled job that isn’t. Conflicting source data is kept, not resolved. The two spreadsheets disagreed on the tenant for eight units, so both readings stay and the resolved field is null until a lease settles it. Unknowns stay blank. I never guess. I test the export by deleting the database and restoring it, because a backup nobody has restored is only a hope.",
      next:
        "Document upload, payment recording, and pulling lease dates out of 858 lease documents. Until that’s done, every lease-expiry alert is silent. The free hosting tier it runs on is licensed for personal, non-commercial use. That covers a portfolio piece. It doesn’t cover being the books for a rental business, so moving is on the list. It’s a hosting change, not a rewrite.",
    },
  },
]
