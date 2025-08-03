import Link from 'next/link';
import { Card } from 'components/card';
import { ContextAlert } from 'components/context-alert';
import { Markdown } from 'components/markdown';
import { RandomQuote } from 'components/random-quote';
import { getNetlifyContext } from 'utils';

const heroContent = `
# Welcome to RealFinTech

We're revolutionizing the financial technology landscape with cutting-edge solutions that empower businesses to thrive in the digital economy.

## Our Services

- **Digital Banking Solutions** - Modern banking infrastructure for fintech startups
- **Payment Processing** - Secure, scalable payment systems
- **Financial Analytics** - AI-powered insights for better decision making
- **Regulatory Compliance** - Automated compliance and risk management
- **API Integration** - Seamless integration with existing financial systems
`;

const featuresContent = `
## Why Choose RealFinTech?

- **Innovation First** - We stay ahead of fintech trends and technologies
- **Security Focused** - Enterprise-grade security for your financial data
- **Scalable Solutions** - Grow with confidence knowing our platform scales with you
- **24/7 Support** - Expert support team available around the clock
- **Compliance Ready** - Built-in compliance features for regulatory requirements
`;

const ctx = getNetlifyContext();

export default function Page() {
    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <section>
                <ContextAlert className="mb-6" />
                <h1 className="mb-4 text-4xl font-bold">RealFinTech</h1>
                <p className="mb-6 text-xl">Innovative Financial Technology Solutions</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/contact" className="btn btn-lg sm:min-w-64 bg-green-600 hover:bg-green-700">
                        Get Started
                    </Link>
                    <Link href="/services" className="btn btn-lg sm:min-w-64 bg-transparent border-2 border-white hover:bg-white hover:text-blue-900">
                        Our Services
                    </Link>
                </div>
            </section>
            
            <section className="flex flex-col gap-4">
                <Markdown content={heroContent} />
            </section>

            <section className="flex flex-col gap-4">
                <Markdown content={featuresContent} />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Digital Banking">
                    <p>Complete digital banking infrastructure for modern financial institutions.</p>
                </Card>
                <Card title="Payment Solutions">
                    <p>Secure, fast, and reliable payment processing for businesses of all sizes.</p>
                </Card>
                <Card title="Financial Analytics">
                    <p>AI-powered insights to drive better financial decisions and growth.</p>
                </Card>
            </section>

            {!!ctx && (
                <section className="flex flex-col gap-4">
                    <Markdown content="## Platform Status" />
                    <RuntimeContextCard />
                </section>
            )}
        </div>
    );
}

function RuntimeContextCard() {
    const title = `RealFinTech Platform: running in ${ctx} mode.`;
    if (ctx === 'dev') {
        return (
            <Card title={title}>
                <p>Development mode - testing new features and improvements.</p>
            </Card>
        );
    } else {
        return (
            <Card title={title}>
                <p>Production mode - serving customers with our latest stable release.</p>
            </Card>
        );
    }
}
