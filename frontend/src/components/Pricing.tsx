import { Check, ArrowRight, Sparkles } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    tagline: 'For landing pages & simple websites',
    price: '₹29,999',
    period: 'starting from',
    features: [
      'Up to 5 pages',
      'Responsive design',
      'Contact form integration',
      'Basic SEO setup',
      'Google Analytics',
      '14 days delivery',
      '1 month support',
    ],
    cta: 'Get Started',
    highlighted: false,
    accent: 'hsl(200 80% 50%)',
  },
  {
    name: 'Growth',
    tagline: 'For startups & growing businesses',
    price: '₹99,999',
    period: 'starting from',
    features: [
      'Up to 15 pages',
      'Custom UI/UX design',
      'CMS integration',
      'Blog & newsletter',
      'Advanced SEO + schema',
      'Performance optimization',
      '30 days delivery',
      '3 months support',
    ],
    cta: 'Start Growing',
    highlighted: true,
    accent: 'hsl(16 100% 50%)',
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    tagline: 'For complex products & SaaS',
    price: 'Custom',
    period: 'tailored quote',
    features: [
      'Unlimited pages / screens',
      'Custom software or SaaS build',
      'API & database architecture',
      'Mobile app (iOS + Android)',
      'Cloud deployment & DevOps',
      'Dedicated team & PM',
      'Priority roadmap',
      '12 months support + SLA',
    ],
    cta: 'Book a Strategy Call',
    highlighted: false,
    accent: 'hsl(38 95% 45%)',
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 relative" data-testid="pricing-section">
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(hsl(38 95% 55% / 0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-widest mb-6">
            Pricing
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-5"
            style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}
          >
            Simple, transparent
            <br />
            <span className="gradient-text">pricing for every stage</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Pick a package and ship fast — or talk to us about a custom build.
            Every project includes discovery, design, development and launch support.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`reveal relative rounded-2xl p-8 flex flex-col transition-all duration-300 ${
                plan.highlighted
                  ? 'border-2 bg-card shadow-[0_30px_80px_-20px_rgba(255,68,0,0.25)] scale-[1.02]'
                  : 'border border-border/60 bg-card hover:-translate-y-1'
              }`}
              style={{
                borderColor: plan.highlighted ? plan.accent : undefined,
                animationDelay: `${i * 0.1}s`,
              }}
              data-testid={`pricing-card-${plan.name.toLowerCase()}`}
            >
              {plan.highlighted && plan.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest text-white"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  <Sparkles size={12} />
                  {plan.badge}
                </div>
              )}

              <div>
                <h3
                  className="text-2xl font-bold mb-1"
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    letterSpacing: '-0.02em',
                    color: plan.highlighted ? plan.accent : undefined,
                  }}
                >
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">{plan.tagline}</p>

                <div className="mb-6">
                  <div
                    className="text-4xl font-black leading-none"
                    style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.04em' }}
                  >
                    {plan.price}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 uppercase tracking-widest">
                    {plan.period}
                  </div>
                </div>
              </div>

              <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${plan.accent}18` }}
                    >
                      <Check size={12} style={{ color: plan.accent }} strokeWidth={3} />
                    </span>
                    <span className="text-foreground/85">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                data-testid={`pricing-cta-${plan.name.toLowerCase()}`}
                className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? 'btn-primary'
                    : 'border border-border hover:border-primary/50 hover:text-primary'
                }`}
              >
                {plan.cta}
                <ArrowRight size={16} />
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10">
          All plans include source code ownership, SEO basics, and a production launch.
          <span className="text-foreground font-medium"> Need something specific?</span>{' '}
          <a href="#contact" className="text-primary font-semibold hover:underline">
            Let's talk →
          </a>
        </p>
      </div>
    </section>
  )
}
