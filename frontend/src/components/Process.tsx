import { MessageSquare, Lightbulb, Code2, Rocket } from 'lucide-react'

const steps = [
  {
    icon: MessageSquare,
    number: '01',
    title: 'Discovery Call',
    description:
      "We start with a deep dive into your goals, audience, and vision. Understanding your business is step one to building something that actually works.",
  },
  {
    icon: Lightbulb,
    number: '02',
    title: 'Design & Strategy',
    description:
      "We map out the architecture, wireframes, and UI design. Every pixel is intentional — beautiful and functional.",
  },
  {
    icon: Code2,
    number: '03',
    title: 'Build & Develop',
    description:
      "Our team writes clean, scalable code. You get updates at every milestone with full transparency into progress.",
  },
  {
    icon: Rocket,
    number: '04',
    title: 'Launch & Support',
    description:
      "We deploy, test, and hand over your product. Ongoing support ensures your digital product stays fast and reliable.",
  },
]

export default function Process() {
  return (
    <section id="process" className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-widest mb-6">
            How We Work
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-5"
            style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}
          >
            Simple Process,
            <br />
            <span className="gradient-text">Exceptional Results</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            From first conversation to product launch — a clear, collaborative process
            that keeps you in control every step of the way.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative reveal" style={{ animationDelay: `${i * 0.12}s` }}>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%+0px)] w-full h-px bg-gradient-to-r from-primary/30 to-transparent z-10" />
              )}

              <div className="service-card rounded-2xl p-6 h-full">
                {/* Number */}
                <div
                  className="text-5xl font-black mb-4 leading-none"
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    color: 'hsl(var(--primary) / 0.15)',
                    letterSpacing: '-0.05em',
                  }}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'hsl(var(--primary) / 0.1)', border: '1px solid hsl(var(--primary) / 0.2)' }}
                >
                  <step.icon size={20} style={{ color: 'hsl(var(--primary))' }} />
                </div>

                {/* Title */}
                <h3
                  className="text-lg font-bold mb-3"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}
                >
                  {step.title}
                </h3>

                {/* Desc */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
