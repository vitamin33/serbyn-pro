import Link from 'next/link';

export function FooterLegal() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted no-print">
      <div className="container py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Company Information */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Easelect LTD
              </h3>
              <p className="text-sm text-muted-foreground">
                AI Systems Architecture
              </p>
              <p className="text-sm text-muted-foreground">
                Company Number: 15983917
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">
                Registered Office:
              </p>
              <address className="not-italic">
                Office 12, Initial Business Centre
                <br />
                Wilson Business Park
                <br />
                Manchester, M40 8WN
                <br />
                United Kingdom
              </address>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Contact</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <a
                    href="mailto:serbyn.vitalii@gmail.com"
                    className="hover:text-primary transition-colors"
                  >
                    serbyn.vitalii@gmail.com
                  </a>
                </p>
                <p>Remote from Kyiv, Ukraine</p>
                <p>GMT+2 timezone</p>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Legal</h3>
              <nav className="space-y-2 text-sm" aria-label="Legal pages">
                <Link
                  href={'/legal/privacy' as any}
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href={'/legal/terms' as any}
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              <p>
                &copy; {currentYear} Easelect LTD. All rights reserved.
                <span className="ml-2 inline-block">
                  Incorporated in England &amp; Wales
                </span>
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a
                href="https://find-and-update.company-information.service.gov.uk/company/15983917"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="View company information at Companies House (opens in new tab)"
              >
                Companies House
              </a>
              <span className="text-border">|</span>
              <span className="font-mono text-xs">UK LTD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
