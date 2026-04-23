const techStack = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Next.js', color: '#0A0A0A' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Node.js', color: '#3C873A' },
  { name: 'Python', color: '#FFD43B' },
  { name: 'Flutter', color: '#02569B' },
  { name: 'React Native', color: '#61DAFB' },
  { name: 'PostgreSQL', color: '#336791' },
  { name: 'MongoDB', color: '#4DB33D' },
  { name: 'AWS', color: '#FF9900' },
  { name: 'Firebase', color: '#FFCA28' },
  { name: 'Tailwind', color: '#06B6D4' },
  { name: 'GraphQL', color: '#E10098' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'Vercel', color: '#000000' },
  { name: 'Stripe', color: '#635BFF' },
  { name: 'WordPress', color: '#21759B' },
  { name: 'Webflow', color: '#4353FF' },
]

export default function TechStack() {
  const row = [...techStack, ...techStack]

  return (
    <section className="py-20 relative overflow-hidden" data-testid="tech-stack-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-widest mb-6">
            Our Toolkit
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}
          >
            Battle-tested <span className="gradient-text">tech stack</span>
          </h2>
          <p className="text-muted-foreground">
            We pick the right tool for the job — modern, scalable, and production-ready.
          </p>
        </div>
      </div>

      {/* Row 1 — left to right */}
      <div className="marquee-container mb-4">
        <div className="flex gap-4 animate-marquee whitespace-nowrap">
          {row.map((t, i) => (
            <div
              key={`r1-${i}`}
              className="flex items-center gap-2.5 shrink-0 px-5 py-3 rounded-full border border-border/60 bg-card hover:border-primary/40 hover:scale-105 transition-all duration-300"
              data-testid={`tech-${i}`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: t.color }}
              />
              <span
                className="text-sm font-semibold"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {t.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — right to left (reversed) */}
      <div className="marquee-container">
        <div
          className="flex gap-4 whitespace-nowrap"
          style={{ animation: 'marquee 40s linear infinite reverse' }}
        >
          {[...row].reverse().map((t, i) => (
            <div
              key={`r2-${i}`}
              className="flex items-center gap-2.5 shrink-0 px-5 py-3 rounded-full border border-border/60 bg-card hover:border-primary/40 hover:scale-105 transition-all duration-300"
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: t.color }}
              />
              <span
                className="text-sm font-semibold"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {t.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
