import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata.howToPay();

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
          <span className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-full">
            Preferred
          </span>
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

export default function HowToPayPage() {
  const paymentMethods = [
    {
      title: 'ACH Transfer',
      description: 'Direct bank transfer for US clients',
      regions: 'United States',
      processingTime: '1-3 business days',
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
        </svg>
      ),
    },
    {
      title: 'Stripe (Cards)',
      description: 'Credit/debit cards via secure Stripe',
      regions: 'Worldwide',
      processingTime: 'Instant',
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
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight">How to Pay</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Flexible payment options for global clients with transparent terms
          </p>
        </div>

        {/* Payment Methods */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Payment Methods
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {paymentMethods.map((method, index) => (
              <PaymentMethodCard key={index} {...method} />
            ))}
          </div>
        </section>

        {/* Invoice Terms */}
        <section className="mb-16">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Invoice Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Billing Details</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Invoices issued from Serbyn Solutions Ltd (UK LTD)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Payment terms: Net 15 days from invoice date</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        W-8BEN-E form available on request for US clients
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>VAT charged as applicable per UK regulations</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Project Structure</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Fixed-price projects: 50% upfront, 50% on completion
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Time & materials: Monthly invoicing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Retainer agreements: Quarterly billing available
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Currency: USD, EUR, or GBP accepted</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Pricing Information */}
        <section className="mb-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">Pricing Structure</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
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
                      Rate varies based on project complexity, timeline, and
                      scope
                    </p>
                    <ul className="text-sm space-y-1 text-left">
                      <li>• MLOps & Infrastructure: $150-175/hr</li>
                      <li>• LLM Fine-tuning & RAG: $175-200/hr</li>
                      <li>• Custom AI Solutions: $175-200/hr</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact for Custom */}
        <section className="text-center">
          <h2 className="text-xl font-semibold mb-4">Custom Arrangements</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Need a different payment structure? Long-term retainer? Volume
            discounts? Let&apos;s discuss what works best for your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href="mailto:vitalii@serbyn.pro?subject=Payment Discussion">
                Discuss Payment Terms
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#contact">Schedule a Call</a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
