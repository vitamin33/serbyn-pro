import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata.payments();

export default function PaymentsPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            Payments & Terms
          </h1>
          <p className="text-xl text-muted-foreground">
            Invoices are USD-denominated. Crypto is preferred for speed and
            lower fees.
          </p>
        </div>

        {/* Payment Methods & Terms */}
        <section className="mb-16">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Methods</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• USDC/USDT on Ethereum (preferred)</li>
                    <li>
                      • ETH accepted at transfer-time spot (Coinbase index or
                      mutually agreed)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Fees</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Client covers on-chain tx fees</li>
                    <li>• No custody of client funds</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Alternatives</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Fiat by wire available on request (USD/EUR)</li>
                    <li>• Same USD-denomination</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Terms & Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Terms & Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Schedule</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Retainers/hourly invoiced weekly (Fri), Net-7</li>
                    <li>
                      • Fixed milestones: 30% deposit, balance Net-0 on
                      acceptance
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Late/Pausing</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• 1.5%/month after 7 days</li>
                    <li>• Work may pause on overdue invoices</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Invoicing</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• PDF invoices</li>
                    <li>• Receipts sent automatically upon payment</li>
                  </ul>
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
                  A: Faster settlement, predictable fees, no bank delays.
                  Invoices remain USD-denominated.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Q: Which network?</h3>
                <p className="text-sm text-muted-foreground">
                  A: Ethereum mainnet or Solana (USDC/USDT).
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  Q: Can we pay in ETH or SOL?
                </h3>
                <p className="text-sm text-muted-foreground">
                  A: Yes—converted at transfer-time spot rate.
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
          <Button size="lg" asChild>
            <a
              href="mailto:serbyn.vitalii@gmail.com?subject=Invoice or SOW Request&body=Hi Vitalii,%0A%0AI'd like to request:%0A[ ] Invoice for services%0A[ ] Statement of Work (SOW)%0A%0AProject details:%0A- Scope:%0A- Timeline:%0A- Budget range:%0A%0APreferred payment method:%0A[ ] Crypto (USDC/USDT)%0A[ ] Wire transfer%0A%0AThanks!"
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Request Invoice or SOW
            </a>
          </Button>
        </section>
      </div>
    </div>
  );
}
