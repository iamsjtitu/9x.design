import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import ClientLogos from './components/ClientLogos'
import Services from './components/Services'
import Process from './components/Process'
import Portfolio from './components/Portfolio'
import TechStack from './components/TechStack'
import Pricing from './components/Pricing'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import Privacy from './components/Privacy'
import Terms from './components/Terms'

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    const els = document.querySelectorAll('.reveal')
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function Landing() {
  useScrollReveal()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <ClientLogos />
        <Services />
        <Process />
        <Portfolio />
        <TechStack />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default function App() {
  // Simple pathname-based routing (no external router dependency needed).
  const path =
    typeof window !== 'undefined'
      ? window.location.pathname.replace(/\/$/, '') || '/'
      : '/'

  if (path === '/privacy') return <Privacy />
  if (path === '/terms') return <Terms />
  return <Landing />
}
