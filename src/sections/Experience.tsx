import FadeIn from '../components/FadeIn'

const ROLES = [
  {
    title: 'Operations & Data Analyst',
    company: 'SM Beauty LLC',
    dates: 'Jan 2026 – Present',
    bullets: [
      "Built the company's first structured BI reporting infrastructure — introduced Power BI and Power Query to replace ad hoc Excel workflows, compressing report cycles from 2–3 days to under 30 minutes.",
      'Absorbed core demand-planning duties after a planner departure — reorder monitoring, backorder-risk flagging, and forecasting support — on top of existing logistics and analytics work.',
      'Ran independent product trend research and pitched recommendations to leadership; one recommendation generated $50,592 in revenue across 7,111 units sold.',
    ],
  },
  {
    title: 'Store Supervisor / Warehouse Manager',
    company: 'The Hijab Vault',
    dates: 'Oct 2024 – Nov 2025',
    bullets: [
      'Oversaw inventory across 2 locations — forecasted stock levels, coordinated reorders, and maintained organization across 20+ SKUs.',
      'Led the full hiring cycle and trained 5+ associates; built and managed monthly schedules across both locations.',
      "Designed a centralized Notion operations workspace and developed the company's Shopify storefront, adding 5 collections with 20+ product variations.",
    ],
  },
  {
    title: 'Sales Associate',
    company: 'The Hijab Vault',
    dates: 'Mar 2023 – Oct 2024',
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
  {
    degree: 'Associate in Arts',
    school: 'College of DuPage',
    year: '2023',
    note: '',
  },
]

export default function Experience() {
  return (
    <section id="experience" className="px-5 sm:px-8 md:px-10 py-24">
      <FadeIn y={40}>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-16"
          style={{ fontSize: 'clamp(2.5rem, 10vw, 130px)' }}
        >
          Experience
        </h2>
      </FadeIn>

      <div className="max-w-[900px] mx-auto relative">
        {/* the rail */}
        <div
          className="absolute left-[7px] top-2 bottom-2 w-px"
          style={{ background: 'var(--line)' }}
          aria-hidden="true"
        />

        {ROLES.map((r, i) => (
          <FadeIn key={r.title + r.dates} delay={i * 0.1} y={30}>
            <div className="relative pl-10 pb-14">
              <span
                className="absolute left-0 top-2 w-[15px] h-[15px] rounded-full border-2"
                style={{
                  borderColor: 'var(--monitor)',
                  background: 'var(--bg)',
                  boxShadow: '0 0 18px rgba(79,201,255,0.5)',
                }}
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-ink font-semibold text-xl sm:text-2xl leading-tight">
                    {r.title}
                  </h3>
                  <p
                    className="font-normal text-base sm:text-lg"
                    style={{ color: 'var(--monitor)' }}
                  >
                    {r.company}
                  </p>
                </div>
                <p className="text-muted uppercase tracking-[0.16em] text-xs font-light">
                  {r.dates}
                </p>
              </div>
              <ul className="mt-4 space-y-2">
                {r.bullets.map((b, j) => (
                  <li
                    key={j}
                    className="text-muted font-light leading-relaxed text-sm sm:text-base pl-4 relative"
                  >
                    <span
                      className="absolute left-0 top-[0.7em] w-1.5 h-1.5 rounded-full"
                      style={{ background: 'var(--line)' }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Education */}
      <FadeIn delay={0.2}>
        <div className="max-w-[900px] mx-auto mt-6 pt-10 border-t" style={{ borderColor: 'var(--line)' }}>
          <p className="text-muted uppercase tracking-[0.18em] text-xs font-light mb-6">
            Education
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {EDU.map((e) => (
              <div key={e.degree}>
                <h4 className="text-ink font-medium text-lg">{e.degree}</h4>
                <p className="text-muted font-light">
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
