import CursorLight from './components/CursorLight'
import SentinelLayer from './components/SentinelLayer'
import Hero from './sections/Hero'
import Marquee from './sections/Marquee'
import About from './sections/About'
import Projects from './sections/Projects'
import Experience from './sections/Experience'
import Interests from './sections/Interests'
import Contact from './sections/Contact'

export default function App() {
  return (
    <main style={{ overflowX: 'clip', background: 'var(--bg)' }}>
      <CursorLight />
      {/* 343 lives outside the section flow now — a fixed layer that drifts
          down the viewport as you scroll rather than a hero centrepiece. */}
      <SentinelLayer />
      <Hero />
      <Marquee />
      <About />
      <Projects />
      <Experience />
      <Interests />
      <Contact />
    </main>
  )
}
