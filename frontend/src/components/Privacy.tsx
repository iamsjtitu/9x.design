import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react'

export default function Privacy() {
  const effective = 'January 24, 2026'

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Slim header */}
      <header className="border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group" data-testid="privacy-logo">
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
            data-testid="privacy-back"
          >
            <ArrowLeft size={15} />
            Back to home
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-widest mb-6">
          <ShieldCheck size={13} />
          Legal · Privacy
        </div>
        <h1
          className="text-4xl sm:text-5xl font-bold mb-4"
          style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}
        >
          Privacy <span className="gradient-text">Policy</span>
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Effective {effective}
        </p>

        <div
          className="mb-12 rounded-2xl border border-primary/40 bg-primary/5 p-6 sm:p-7"
          data-testid="privacy-drive-file-callout"
        >
          <div className="flex items-start gap-3">
            <ShieldCheck size={20} className="text-primary shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                MillEntry Backup · Google Drive access
              </div>
              <p className="text-[15px] leading-[1.7] text-foreground">
                MillEntry Backup only accesses the backup files it creates in your Google Drive
                (<code className="bg-secondary px-1.5 py-0.5 rounded text-sm">drive.file</code> scope).
                We do not store, read or share your Drive data. You can revoke access anytime from
                your <strong>Google Account → Security → Third-party access</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-10 text-[15px] leading-[1.75] text-foreground/85">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              1. Summary
            </h2>
            <p>
              9x.design (&quot;we&quot;, &quot;us&quot;) builds tools for rice-mill and small-business operators —
              including <strong>MillEntry Backup</strong>, a small utility that lets you backup your
              MillEntry data file to your own Google Drive. This policy explains exactly what that
              utility can (and cannot) see, and what we do with it. Short answer: nothing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              2. What data we access
            </h2>
            <p className="mb-3">
              MillEntry Backup uses the Google Drive API with a single, restricted scope:{' '}
              <code className="bg-secondary px-1.5 py-0.5 rounded text-sm">drive.file</code>.
            </p>
            <p>
              This scope lets the app read and write <strong>only the files it has created itself</strong> in
              your Google Drive (i.e., the backup files it uploads on your instruction). It cannot see,
              list, download, or modify any other file, folder, photo, or document in your Drive.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              3. What data we store on our servers
            </h2>
            <p>
              <strong>None.</strong> We do not upload, copy, cache, or otherwise transmit your backup
              files or their contents to any 9x.design server. The Google OAuth exchange happens in
              your app, tokens are stored locally on the device that runs MillEntry Backup, and the
              backup file goes directly from your machine to your Google Drive.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              4. Third parties
            </h2>
            <p>
              The only third party involved is Google itself — for authentication and for hosting
              your backup on your own Google Drive. Your use of Google&apos;s services is subject to
              <a
                className="text-primary hover:underline mx-1"
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google&apos;s Privacy Policy
              </a>
              and Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              5. Revoking access
            </h2>
            <p>
              You can disconnect MillEntry Backup at any time by visiting{' '}
              <a
                className="text-primary hover:underline"
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Account → Third-party apps with account access
              </a>
              . Once revoked, the app can no longer read or write any files.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              6. Contact
            </h2>
            <p>
              For any questions about this policy, write to us at{' '}
              <a
                className="text-primary font-medium hover:underline inline-flex items-center gap-1"
                href="mailto:sales@9x.design"
              >
                <Mail size={14} />
                sales@9x.design
              </a>
              . We reply within 24 hours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              7. Changes
            </h2>
            <p>
              If we materially change this policy, we&apos;ll update the &quot;Effective&quot; date at the top of
              this page and, where reasonable, notify active users. Continued use of MillEntry Backup
              after such an update constitutes acceptance of the revised policy.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} 9x.design. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="/" className="hover:text-foreground transition-colors">Home</a>
          </div>
        </div>
      </main>
    </div>
  )
}
