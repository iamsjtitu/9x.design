import { ArrowUpRight, Package, CloudUpload } from 'lucide-react'

const products = [
  {
    name: 'MillEntry',
    tagline: 'Complete rice-mill management platform',
    description:
      'Data entry, weighbridge, stock, billing, GST reports, and multi-branch analytics — trusted by 100+ mills across India.',
    icon: Package,
    color: 'hsl(16 100% 50%)',
    href: 'https://mill.9x.design',
    linkLabel: 'Learn more',
  },
  {
    name: 'MillEntry Backup',
    tagline: 'Google Drive cloud backup for MillEntry',
    description:
      'A small utility that securely uploads your MillEntry data file to your own Google Drive using the restricted drive.file scope — nothing is stored on our servers.',
    icon: CloudUpload,
    color: 'hsl(38 95% 55%)',
    href: '/privacy',
    linkLabel: 'Privacy & data policy',
  },
]

export default function Products() {
  return (
    <section id="products" className="py-20 bg-secondary/30 border-y border-border/60" data-testid="products-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-widest mb-6">
            Our Products
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}
          >
            Software we <span className="gradient-text">build & operate</span>
          </h2>
          <p className="text-muted-foreground">
            Alongside client work, we run our own SaaS products used by hundreds of businesses.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {products.map((p) => (
            <div
              key={p.name}
              className="service-card rounded-2xl p-8 reveal group"
              data-testid={`product-card-${p.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  style={{
                    background: `${p.color}18`,
                    border: `1px solid ${p.color}30`,
                  }}
                >
                  <p.icon size={22} style={{ color: p.color }} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-xl font-bold leading-tight mb-1"
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {p.name}
                  </h3>
                  <p className="text-sm text-muted-foreground italic">{p.tagline}</p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-foreground/80 mb-5">
                {p.description}
              </p>

              <a
                href={p.href}
                target={p.href.startsWith('http') ? '_blank' : undefined}
                rel={p.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:underline"
                style={{ color: p.color }}
                data-testid={`product-link-${p.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {p.linkLabel}
                <ArrowUpRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
