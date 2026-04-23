import { Monitor, Code2, Smartphone, ArrowUpRight, CheckCircle2 } from 'lucide-react'

const services = [
  {
    icon: Monitor,
    title: 'Website Development',
    subtitle: 'Web Design & Development',
    description:
      'Hum stunning, high-performance websites design aur build karte hain jo visitors ko customers mein convert karti hain. Landing pages se lekar full enterprise portals tak — sab kuch.',
    features: [
      'Custom UI/UX Design',
      'SEO Optimized & Fast',
      'Mobile Responsive',
      'CMS Integration (WordPress, Strapi)',
      'E-Commerce Solutions',
      'Landing Pages & Portfolios',
    ],
    tags: ['React', 'Next.js', 'WordPress', 'Webflow'],
    color: 'hsl(16 100% 50%)',
    bgColor: 'hsl(16 100% 50% / 0.06)',
    borderColor: 'hsl(16 100% 50% / 0.15)',
    ideal: 'Startups, Businesses, E-Commerce',
  },
  {
    icon: Code2,
    title: 'Software Development',
    subtitle: 'Custom Software & SaaS',
    description:
      'Scalable, robust software solutions jo aapke business ki zaroorat ke hisaab se tailor ki gayi hain. SaaS platforms, CRMs, ERPs, aur enterprise tools — ground up se build karte hain.',
    features: [
      'SaaS Product Development',
      'CRM & ERP Systems',
      'API Design & Development',
      'Database Architecture',
      'Cloud Deployment (AWS, GCP)',
      'DevOps & CI/CD Pipelines',
    ],
    tags: ['Node.js', 'Python', 'PostgreSQL', 'AWS'],
    color: 'hsl(38 95% 45%)',
    bgColor: 'hsl(38 95% 55% / 0.06)',
    borderColor: 'hsl(38 95% 55% / 0.15)',
    ideal: 'Enterprises, Funded Startups, Agencies',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    subtitle: 'iOS & Android Apps',
    description:
      'Pixel-perfect mobile experiences iOS aur Android ke liye. Hum native aur cross-platform apps banate hain jo users har roz khol ke khush hote hain.',
    features: [
      'iOS & Android (Cross-Platform)',
      'React Native / Flutter',
      'Push Notifications & Alerts',
      'Offline Support',
      'App Store & Play Store Launch',
      'Performance Optimization',
    ],
    tags: ['React Native', 'Flutter', 'Firebase', 'Expo'],
    color: 'hsl(200 80% 45%)',
    bgColor: 'hsl(200 80% 55% / 0.06)',
    borderColor: 'hsl(200 80% 55% / 0.15)',
    ideal: 'Startups, D2C Brands, Marketplaces',
  },
]

const addons = [
  { label: 'UI/UX Design', desc: 'Wireframes, prototypes & design systems' },
  { label: 'QA & Testing', desc: 'Manual & automated testing' },
  { label: 'Maintenance', desc: 'Monthly support & updates' },
  { label: 'Consulting', desc: 'Technical architecture review' },
]

export default function Services() {
  return (
    <section id="services" className="py-24 relative">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(hsl(16 100% 50% / 0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-widest mb-6">
            What We Do
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-5 leading-tight"
            style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}
          >
            Services Built to
            <br />
            <span className="gradient-text">Scale Your Business</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Concept se launch tak — har layer handle karte hain ek
            disciplined process, expert team, aur result-first approach ke saath.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {services.map((service, i) => (
            <div
              key={i}
              className="reveal service-card rounded-2xl overflow-hidden group cursor-pointer flex flex-col"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Card top color bar */}
              <div
                className="h-1 w-full"
                style={{ background: `linear-gradient(90deg, ${service.color}, transparent)` }}
              />

              <div className="p-8 flex flex-col flex-1">
                {/* Icon + subtitle */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: service.bgColor, border: `1px solid ${service.borderColor}` }}
                  >
                    <service.icon size={26} style={{ color: service.color }} />
                  </div>
                  <span
                    className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ background: service.bgColor, color: service.color }}
                  >
                    {i === 0 ? 'Web' : i === 1 ? 'Software' : 'Mobile'}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-2xl font-bold mb-3 leading-tight"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Feature List */}
                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2
                        size={15}
                        className="shrink-0"
                        style={{ color: service.color }}
                      />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2.5 py-1 rounded-full border border-border/70 text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Ideal for */}
                <div
                  className="text-xs text-muted-foreground px-3 py-2 rounded-lg mb-6"
                  style={{ background: service.bgColor }}
                >
                  <span className="font-semibold" style={{ color: service.color }}>Ideal for:</span>{' '}
                  {service.ideal}
                </div>

                {/* CTA */}
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group-hover:gap-3 mt-auto"
                  style={{ color: service.color }}
                >
                  Get a Free Quote
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons strip */}
        <div className="reveal rounded-2xl border border-border/60 bg-secondary/40 p-6">
          <p
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 text-center"
          >
            Additional Services
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {addons.map((addon) => (
              <div
                key={addon.label}
                className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-background hover:border-primary/30 transition-colors duration-200"
              >
                <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {addon.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{addon.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
