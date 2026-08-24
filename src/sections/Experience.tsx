import FadeIn from '../components/FadeIn'

const ROLES = [
  {
    title: 'Operations & Data Analyst',
    company: 'SM Beauty LLC',
    dates: 'Jan 2026 — Present',
    bullets: [
      "Built the company's first structured BI reporting infrastructure — introduced Power BI and Power Query to replace ad hoc Excel workflows, compressing report cycles from 2–3 days to under 30 minutes.",
      'Absorbed core demand-planning duties after a planner departure — reorder monitoring, backorder-risk flagging, and forecasting support — on top of existing logistics and analytics work.',
      'Ran independent product trend research and pitched recommendations to leadership; one recommendation generated $50,592 in revenue across 7,111 units sold.',
    ],
  },
  {
    title: 'Store Supervisor / Warehouse Manager',
    company: 'The Hijab Vault',
    dates: 'Oct 2024 — Nov 2025',
    bullets: [
      'Oversaw inventory across 2 locations — forecasted stock levels, coordinated reorders, and maintained organisation across 20+ SKUs.',
      'Led the full hiring cycle and trained 5+ associates; built and managed monthly schedules across both locations.',
      "Designed a centralised Notion operations workspace and developed the company's Shopify storefront, adding 5 collections with 20+ product variations.",
    ],
  },
  {
    title: 'Sales Associate',
    company: 'The Hijab Vault',
    dates: 'Mar 2023 — Oct 2024',
    bullets: [
      'Managed day-to-day boutique operations — shipment receiving, restocking 20+ SKUs, and processing transactions with consistent accuracy.',
    ],
  },
]

const EDU = [
  {
    degree: 'B.S. Computer Information Systems',
    school: 'Elmhurst University',
    year: '2025',
    note: 'GPA 4.0',
  },
  { degree: 'Associate in Arts', school: 'College of DuPage', year: '2023', note: '' },
]

export default function Experience() {
  return (
    <section
      id="experience"
      className="mx-auto max-w-[1180px] px-[6vw] py-[14vh]"
    >
      <FadeIn y={30}>
        <div className="mb-[7vh] flex items-baseline gap-[18px]">
          <span className="label">03</span>
          <div className="rule w-[clamp(40px,7vw,90px)]" />
          <span className="eyebrow">Experience</span>
        </div>
      </FadeIn>

      <div className="max-w-[880px]">
        {ROLES.map((r, i) => (
          <FadeIn key={r.title + r.dates} delay={i * 0.08} y={26}>
            {/* Each role is a ledger row: rule above, date in mono on the
                left, everything else in a single measure on the right. */}
            <div className="grid grid-cols-1 gap-x-[5vw] gap-y-[14px] border-t
                            border-[var(--edge)] py-[38px] md:grid-cols-[140px_1fr]">
              <div className="label pt-[6px]">{r.dates}</div>

              <div>
                <h3 className="display text-[clamp(1.5rem,2.8vw,2.15rem)]">
                  {r.title}
                </h3>
                <p className="mono mt-[9px] text-[10px] text-[var(--line)]">
                  {r.company}
                </p>

                <ul className="mt-[22px] flex flex-col gap-[13px]">
                  {r.bullets.map((b, j) => (
                    <li
                      key={j}
                      className="relative pl-[20px] text-[clamp(0.88rem,1.1vw,0.97rem)]
                                 leading-[1.8] text-muted"
                    >
                      <span
                        aria-hidden
                        className="absolute left-0 top-[0.78em] h-[3px] w-[3px]
                                   rounded-full bg-[var(--line)] opacity-70"
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* ---------------- education ---------------- */}
      <FadeIn delay={0.15}>
        <div className="mt-[6vh] max-w-[880px] border-t border-[var(--edge)] pt-[38px]">
          <p className="label mb-[26px]">Education</p>
          <div className="grid gap-[26px] sm:grid-cols-2">
            {EDU.map((e) => (
              <div key={e.degree}>
                <h4 className="text-[15px] text-ink">{e.degree}</h4>
                <p className="mono mt-[8px] text-[9.5px] text-faint">
                  {e.school} · {e.year}
                  {e.note && ` · ${e.note}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
