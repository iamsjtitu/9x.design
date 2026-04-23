import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: 'How long does a typical project take?',
    a: 'Timelines depend on scope. A landing page can go live in 1–2 weeks. Growth websites take 3–5 weeks, and complex SaaS products or mobile apps run 2–6 months. We break every engagement into milestones so you see progress weekly.',
  },
  {
    q: 'Do you work with startups or only established businesses?',
    a: 'Both. We love working with pre-seed and seed-stage startups who need to ship fast and iterate — and with established businesses looking to modernize their digital presence. Budget and ambition matter more than stage.',
  },
  {
    q: 'What is your process for collaboration and updates?',
    a: 'You get a dedicated project manager, a shared Slack or WhatsApp channel, and weekly demos. We use Figma for design handoffs, Linear/Jira for tasks, and GitHub for code — you have full visibility at every step.',
  },
  {
    q: 'Will I own the code and design assets after the project?',
    a: 'Yes. 100%. Once the final invoice is cleared, all source code, designs, and assets transfer to you. No vendor lock-in, no hidden licenses.',
  },
  {
    q: 'Do you provide post-launch support & maintenance?',
    a: 'Every plan includes 1–12 months of support depending on the tier. After that, we offer monthly retainers for bug fixes, feature additions, performance monitoring, and infrastructure upkeep.',
  },
  {
    q: 'Can you work with our existing team or tech stack?',
    a: 'Absolutely. We frequently augment in-house teams, take over legacy codebases, or integrate with your preferred tools (AWS, GCP, Firebase, Supabase, etc.). Tell us what you use and we adapt.',
  },
  {
    q: 'How do payments work?',
    a: 'We typically split into 3 milestones — 40% to kick off, 40% at design/dev midpoint, and 20% on launch. For larger engagements we do monthly invoicing. We accept bank transfer, UPI, and international wire.',
  },
  {
    q: 'Do you sign NDAs and contracts?',
    a: 'Yes. Every engagement starts with an MSA + SOW. We are happy to sign your NDA before the discovery call — just send it over.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 bg-secondary/30" data-testid="faq-section">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-widest mb-6">
            FAQ
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}
          >
            Questions, <span className="gradient-text">answered</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know before we start working together.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className={`reveal rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-primary/40 bg-card shadow-[0_10px_40px_-10px_rgba(255,68,0,0.15)]'
                    : 'border-border/60 bg-card hover:border-border'
                }`}
                style={{ animationDelay: `${i * 0.05}s` }}
                data-testid={`faq-item-${i}`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left"
                  data-testid={`faq-toggle-${i}`}
                >
                  <span
                    className="text-base sm:text-lg font-semibold pr-2"
                    style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.01em' }}
                  >
                    {faq.q}
                  </span>
                  <span
                    className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isOpen ? 'btn-primary text-white' : 'bg-secondary text-foreground'
                    }`}
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p
                      className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-muted-foreground leading-relaxed"
                      data-testid={`faq-answer-${i}`}
                    >
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10">
          Still have questions?{' '}
          <a href="#contact" className="text-primary font-semibold hover:underline">
            Reach out directly →
          </a>
        </p>
      </div>
    </section>
  )
}
