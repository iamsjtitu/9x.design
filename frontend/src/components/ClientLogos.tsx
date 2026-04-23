export default function ClientLogos() {
  // Generic industry-style client mark names; swap with real client names later
  const logos = [
    'ACME Corp',
    'NOVA Labs',
    'PIXEL.io',
    'Orbitly',
    'HealthBridge',
    'FoodFleet',
    'FinForge',
    'Lumen',
    'CraftHQ',
    'TechVentures',
    'BlueRail',
    'Stackpath',
  ]

  const row = [...logos, ...logos]

  return (
    <section className="py-14 border-b border-border/40 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p
          className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-8"
          data-testid="clients-heading"
        >
          Trusted by founders & teams at
        </p>
        <div className="marquee-container">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {row.map((name, i) => (
              <div
                key={i}
                className="flex items-center gap-2 shrink-0 px-2"
                data-testid={`client-logo-${i}`}
              >
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-black text-white"
                  style={{ background: 'linear-gradient(135deg,hsl(16 100% 50%),hsl(38 95% 55%))' }}
                >
                  {name.charAt(0)}
                </div>
                <span
                  className="text-xl font-semibold text-foreground/70"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
