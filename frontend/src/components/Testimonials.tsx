import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'CEO, TechVentures India',
    avatar: 'RS',
    avatarBg: 'hsl(16 100% 50%)',
    content:
      '9x.design transformed our online presence completely. Our website traffic doubled in 3 months post-launch. Their attention to detail and technical expertise is unmatched.',
    rating: 5,
  },
  {
    name: 'Priya Mehta',
    role: 'Founder, HealthBridge',
    avatar: 'PM',
    avatarBg: 'hsl(38 95% 55%)',
    content:
      'The SaaS platform they built for us handles 5,000+ daily users flawlessly. Scalable, secure, and delivered on time. I highly recommend 9x.design for any complex software project.',
    rating: 5,
  },
  {
    name: 'Arjun Patel',
    role: 'Product Manager, FoodFleet',
    avatar: 'AP',
    avatarBg: 'hsl(200 80% 55%)',
    content:
      "Our food delivery app has a 4.9 star rating on both app stores. The UX is buttery smooth. 9x.design's mobile team is world-class.",
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section id="about" className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-widest mb-6">
            Client Love
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-5"
            style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}
          >
            What Our Clients
            <br />
            <span className="gradient-text">Say About Us</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't just take our word for it — here's what the people we've worked with have to say.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="service-card rounded-2xl p-7 flex flex-col reveal"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              {/* Quote icon */}
              <Quote size={28} className="text-primary/30 mb-5" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} fill="hsl(38 95% 55%)" color="hsl(38 95% 55%)" />
                ))}
              </div>

              {/* Content */}
              <p className="text-sm leading-relaxed text-muted-foreground mb-6 flex-1">
                "{t.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: t.avatarBg }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
