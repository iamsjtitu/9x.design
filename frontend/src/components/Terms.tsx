import { ArrowLeft, Mail, FileText } from 'lucide-react'

export default function Terms() {
  const effective = 'January 24, 2026'

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Slim header */}
      <header className="border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group" data-testid="terms-logo">
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
          <a
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            data-testid="terms-back"
          >
            <ArrowLeft size={15} />
            Back to home
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-widest mb-6">
          <FileText size={13} />
          Legal · Terms
        </div>
        <h1
          className="text-4xl sm:text-5xl font-bold mb-4"
          style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}
        >
          Terms of <span className="gradient-text">Service</span>
        </h1>
        <p className="text-sm text-muted-foreground mb-12">
          Effective {effective}
        </p>

        <div className="space-y-10 text-[15px] leading-[1.75] text-foreground/85">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              1. Agreement
            </h2>
            <p>
              By installing, accessing, or using <strong>MillEntry</strong> and its companion utilities
              (including <strong>MillEntry Backup</strong>) provided by 9x.design (&quot;we&quot;,
              &quot;us&quot;), you agree to these Terms of Service. If you do not agree, please do not
              use the software.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              2. What the service does
            </h2>
            <p>
              MillEntry is a rice-mill management platform (data entry, weighbridge integration, stock,
              billing, reports). MillEntry Backup is an optional utility that uploads a copy of your
              MillEntry data file to your own Google Drive so you can restore it if the mill PC fails.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              3. Your responsibilities
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide accurate business information and keep your license credentials confidential.</li>
              <li>Ensure your Google account has enough Drive storage for backup files.</li>
              <li>Comply with all applicable laws in your jurisdiction (tax, GST, labour, etc.).</li>
              <li>Do not attempt to reverse-engineer, resell, or redistribute the software.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              4. Licence
            </h2>
            <p>
              We grant you a non-exclusive, non-transferable licence to use MillEntry on the number of
              mills / devices covered by your active plan. The licence is revocable if these terms are
              violated. Ownership of the software remains with 9x.design.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              5. Data & backups
            </h2>
            <p>
              You retain full ownership of your data at all times. MillEntry Backup stores files only
              in <strong>your</strong> Google Drive under the restricted <code className="bg-secondary px-1.5 py-0.5 rounded text-sm">drive.file</code>{' '}
              scope — we do not receive or store your data on our servers. Please see our{' '}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> for details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              6. Warranty disclaimer
            </h2>
            <p>
              The software is provided <em>&quot;as is&quot;</em> without warranty of any kind. While we
              work hard to keep MillEntry reliable, we do not guarantee that it will be uninterrupted,
              error-free, or perfectly suited to every mill&apos;s workflow. You are responsible for
              maintaining independent backups where mission-critical.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              7. Limitation of liability
            </h2>
            <p>
              To the maximum extent permitted by law, 9x.design shall not be liable for any indirect,
              incidental, or consequential damages arising from use of the software. Our total
              aggregate liability shall not exceed the fees paid by you in the twelve (12) months
              preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              8. Termination
            </h2>
            <p>
              You may stop using the software at any time. We may suspend or terminate access for
              breach of these terms, non-payment, or misuse. On termination you may export or delete
              your data at your discretion — we retain nothing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              9. Governing law
            </h2>
            <p>
              These terms are governed by the laws of India. Any disputes shall be subject to the
              exclusive jurisdiction of the courts in India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              10. Contact
            </h2>
            <p>
              Questions? Write to{' '}
              <a
                className="text-primary font-medium hover:underline inline-flex items-center gap-1"
                href="mailto:sales@9x.design"
              >
                <Mail size={14} />
                sales@9x.design
              </a>
              . We respond within 24 hours.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} 9x.design. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="/" className="hover:text-foreground transition-colors">Home</a>
          </div>
        </div>
      </main>
    </div>
  )
}
