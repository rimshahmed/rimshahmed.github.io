import CursorLight from './components/CursorLight'
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
