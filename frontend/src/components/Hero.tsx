import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(hsl(220 14% 70% / 0.4) 1px, transparent 1px),
            linear-gradient(90deg, hsl(220 14% 70% / 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glowing orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'hsl(16 100% 50% / 0.08)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'hsl(38 95% 55% / 0.06)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 pt-40">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div>
            {/* Badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-8">
              <Sparkles size={14} />
              <span>Website · Software · Mobile App</span>
            </div>

            {/* Headline */}
            <h1
              className="animate-fade-in-up delay-100 text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6"
              style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.04em' }}
            >
              We Build
              <br />
              <span className="gradient-text">Digital Products</span>
              <br />
              That Perform.
            </h1>

            {/* Subtext */}
            <p
              className="animate-fade-in-up delay-200 text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              9x.design is a full-service digital studio. We craft high-impact websites,
              custom software, and powerful mobile apps that help businesses grow 9x faster.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up delay-300 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base"
              >
                Start Your Project
                <ArrowRight size={18} />
              </a>
              <a
                href="#work"
                className="btn-outline inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base"
              >
                View Our Work
              </a>
            </div>

            {/* Trust line */}
            <div className="animate-fade-in-up delay-400 mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {['#FF6B35', '#FFA500', '#FF4400', '#FFD700'].map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background"
                    style={{ background: color }}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Trusted by <span className="text-foreground font-semibold">50+ clients</span> worldwide
              </p>
            </div>
          </div>

          {/* Right — Visual */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              {/* Main card */}
              <div
                className="animate-float w-80 h-80 rounded-3xl border border-border/60 bg-card flex flex-col items-center justify-center gap-6 p-8"
                style={{ boxShadow: 'var(--shadow-card), 0 0 60px hsl(16 100% 50% / 0.08)' }}
              >
                <div
                  className="w-20 h-20 rounded-2xl btn-primary flex items-center justify-center text-3xl font-bold animate-pulse-glow"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  9x
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    9x.design
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Full-Service Digital Studio</p>
                </div>
                <div className="grid grid-cols-3 gap-3 w-full">
                  {['Web', 'App', 'SaaS'].map((tag) => (
                    <div
                      key={tag}
                      className="text-xs font-medium text-center py-1.5 px-2 rounded-lg border border-border/60 text-muted-foreground"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge — top right */}
              <div
                className="animate-fade-in delay-500 absolute -top-4 -right-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full"
              >
                100+ Projects
              </div>

              {/* Floating badge — bottom left */}
              <div
                className="animate-fade-in delay-600 absolute -bottom-4 -left-4 bg-card border border-border/60 text-foreground text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Available for Work
              </div>

              {/* Decorative ring */}
              <div
                className="animate-spin-slow absolute inset-0 -m-8 rounded-full border border-primary/10 border-dashed"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
