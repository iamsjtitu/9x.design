import { Twitter, Linkedin, Instagram, Github, ArrowUpRight } from 'lucide-react'

const links = {
  Services: ['Website Development', 'Software Development', 'Mobile App Development', 'UI/UX Design'],
  Company: ['About Us', 'Our Work', 'Process', 'Pricing', 'FAQ'],
  Connect: [
    { label: 'sales@9x.design', href: 'mailto:sales@9x.design' },
    { label: '+91 98765 43210', href: 'tel:+919876543210' },
    { label: 'WhatsApp', href: 'https://wa.me/919876543210' },
    { label: 'Book a Call', href: '#contact' },
  ],
}

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Github, href: '#', label: 'GitHub' },
]

function isConnectLinkList(arr: any): arr is { label: string; href: string }[] {
  return Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'object'
}

export default function Footer() {
  return (
    <footer className="border-t border-border/40" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center text-sm font-bold">
                9x
              </div>
              <span
                className="text-lg font-bold"
                style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}
              >
                9x<span className="gradient-text">.</span>design
              </span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              A full-service digital studio building websites, software, and mobile apps
              that help businesses grow 9x faster.
            </p>
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  data-testid={`social-${social.label.toLowerCase()}`}
                  className="w-9 h-9 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4
                className="text-sm font-semibold mb-4"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {group}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {isConnectLinkList(items)
                  ? items.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 inline-flex items-center gap-1"
                          {...(item.href.startsWith('http')
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                        >
                          {item.label}
                          {item.href.startsWith('http') && (
                            <ArrowUpRight size={12} className="opacity-60" />
                          )}
                        </a>
                      </li>
                    ))
                  : (items as string[]).map((item) => (
                      <li key={item}>
                        <a
                          href={
                            item === 'Pricing'
                              ? '#pricing'
                              : item === 'FAQ'
                              ? '#faq'
                              : item === 'Process'
                              ? '#process'
                              : item === 'Our Work'
                              ? '#work'
                              : item === 'About Us'
                              ? '#about'
                              : '#services'
                          }
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} 9x.design. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
