import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { ScheduleCallButton } from '@/components/calendly-widget';

export const metadata = pageMetadata.payments();

interface PaymentMethodProps {
  title: string;
  description: string;
  regions: string;
  processingTime: string;
  icon: React.ReactNode;
  preferred?: boolean;
}

function PaymentMethodCard({
  title,
  description,
  regions,
  processingTime,
  icon,
  preferred = false,
}: PaymentMethodProps) {
  return (
    <Card className={`relative ${preferred ? 'ring-2 ring-primary' : ''}`}>
      {preferred && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground text-xs font-medium">
            Preferred
          </Badge>
        </div>
      )}
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="text-center space-y-2">
        <div className="text-sm">
          <span className="font-medium">Regions:</span> {regions}
        </div>
        <div className="text-sm">
          <span className="font-medium">Processing:</span> {processingTime}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentsPage() {
  const paymentMethods = [
    {
      title: 'Crypto (USDC/USDT)',
      description: 'Stablecoins on multiple networks',
      regions: 'Global',
      processingTime: '5-15 minutes',
      preferred: true,
      icon: (
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      title: 'ACH Transfer',
      description: 'Direct bank transfer for US clients',
      regions: 'United States',
      processingTime: '1-3 business days',
      icon: (
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
    {
      title: 'SEPA Transfer',
      description: 'Single Euro Payments Area transfer',
      regions: 'European Union',
      processingTime: 'Same day',
      icon: (
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Wise Transfer',
      description: 'Low-cost international transfers',
      regions: 'Global',
      processingTime: '1-2 business days',
      icon: (
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            Payments & Terms
          </h1>
          <p className="text-xl text-muted-foreground">
            Fast, secure cryptocurrency payments preferred. All invoices are
            USD-denominated with flexible traditional options available.
          </p>
        </div>

        {/* Payment Methods */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Payment Methods
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {paymentMethods.map((method, index) => (
              <PaymentMethodCard key={index} {...method} />
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Crypto preferred:</strong> Faster settlement, predictable
              fees, no bank delays
            </p>
          </div>
        </section>

        {/* Crypto Payment Details - Highlighted */}
        <section className="mb-16">
          <Card className="max-w-4xl mx-auto border-primary/20 bg-primary/5">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <span>🚀</span>
                Cryptocurrency Payments
                <Badge variant="secondary">Recommended</Badge>
              </CardTitle>
              <p className="text-muted-foreground">
                Fast, secure stablecoin payments on multiple networks
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">
                    Supported Stablecoins
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>USDC</strong> - USD Coin (recommended)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>USDT</strong> - Tether USD
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>ETH/SOL</strong> - Converted at spot rate
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Supported Networks</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Ethereum</strong> - ERC-20 tokens
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Solana</strong> - Fast, low-cost (recommended)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Tron</strong> - Minimal transaction fees
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-background/80 p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">Crypto Payment Process</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>
                    Invoice sent with crypto option and current exchange rate
                  </li>
                  <li>Wallet address provided for chosen network</li>
                  <li>
                    Payment confirmed on blockchain (5-15 minute settlement)
                  </li>
                  <li>Receipt issued with transaction hash reference</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Terms & Pricing */}
        <section className="mb-16">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Terms & Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Payment Schedule</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Hourly/retainer: Weekly invoicing (Fri), Net-7</li>
                    <li>• Fixed projects: 50% upfront, 50% on completion</li>
                    <li>
                      • Milestones: 30% deposit, balance Net-0 on acceptance
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Invoice Details</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Invoices issued from Easelect LTD (UK)</li>
                    <li>• W-8BEN-E form available for US clients</li>
                    <li>• VAT charged as applicable per UK regulations</li>
                    <li>• 1.5%/month late fee after 7 days</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    $150-200
                  </div>
                  <div className="text-sm text-muted-foreground">
                    per hour USD
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Rate varies based on project complexity and scope
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• MLOps & Infrastructure: $150-175/hr</li>
                    <li>• LLM Fine-tuning & RAG: $175-200/hr</li>
                    <li>• Custom AI Solutions: $175-200/hr</li>
                  </ul>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Currency: USD, EUR, GBP, or crypto stablecoins
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Q: Why crypto preferred?</h3>
                <p className="text-sm text-muted-foreground">
                  A: Faster settlement (5-15 min vs 1-3 days), predictable fees,
                  no bank delays. All invoices remain USD-denominated for
                  clarity.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  Q: Which network is cheapest?
                </h3>
                <p className="text-sm text-muted-foreground">
                  A: Solana (USDC) has the lowest fees (~$0.01). Tron (USDT) is
                  also very cheap. Ethereum works but has higher gas fees.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  Q: Can we pay in ETH or other tokens?
                </h3>
                <p className="text-sm text-muted-foreground">
                  A: Yes—converted at transfer-time spot rate (Coinbase index or
                  mutually agreed). Client covers network fees.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  Q: What about traditional payments?
                </h3>
                <p className="text-sm text-muted-foreground">
                  A: ACH (US), SEPA (EU), Wise, and Stripe are available. Same
                  USD pricing, just slower settlement times.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contact me to discuss your project requirements and receive a
            detailed SOW with payment terms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a
                href="mailto:serbyn.vitalii@gmail.com?subject=Invoice or SOW Request&body=Hi Vitalii,%0A%0AI'd like to request:%0A[ ] Invoice for services%0A[ ] Statement of Work (SOW)%0A%0AProject details:%0A- Scope:%0A- Timeline:%0A- Budget range:%0A%0APreferred payment method:%0A[ ] Crypto (USDC/USDT)%0A[ ] Wire transfer%0A%0AThanks!"
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Request Invoice or SOW
              </a>
            </Button>
            <ScheduleCallButton variant="outline" size="lg" />
          </div>
        </section>
      </div>
    </div>
  );
}
