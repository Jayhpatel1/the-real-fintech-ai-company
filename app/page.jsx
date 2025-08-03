import Link from 'next/link';
import { Card } from 'components/card';
import { ContextAlert } from 'components/context-alert';
import { Markdown } from 'components/markdown';
import { RandomQuote } from 'components/random-quote';
import { getNetlifyContext } from 'utils';

const contextExplainer = `
This deployment is running in **${getNetlifyContext() || 'unknown'}** mode. 
The Real Fintech platform adapts to different environments for optimal performance.
`;

const preDynamicContentExplainer = `
Real-time financial insights powered by our advanced API. The content below is fetched dynamically:
`;

const postDynamicContentExplainer = `
Our platform leverages cutting-edge technology to deliver real-time financial data and insights.
Built on modern serverless architecture for maximum reliability and performance.

Stay ahead of the market with The Real Fintech's innovative solutions.
`;

const ctx = getNetlifyContext();

export default function Page() {
    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <section>
                <ContextAlert className="mb-6" />
                <h1 className="mb-4">The Real Fintech</h1>
                <p className="mb-6 text-lg">Authentic financial technology solutions for the modern world.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="#services" className="btn btn-lg sm:min-w-64">
                        Our Services
                    </Link>
                    <Link href="#contact" className="btn btn-lg btn-outline sm:min-w-64">
                        Get Started
                    </Link>
                </div>
            </section>
            
            <section id="services" className="flex flex-col gap-6">
                <h2 className="text-3xl font-bold">Financial Technology Solutions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card title="Payment Processing">
                        <p>Secure, fast, and reliable payment processing solutions for businesses of all sizes.</p>
                    </Card>
                    <Card title="Digital Banking">
                        <p>Next-generation banking infrastructure with real-time analytics and compliance.</p>
                    </Card>
                    <Card title="Blockchain Solutions">
                        <p>Enterprise-grade blockchain technology for secure and transparent transactions.</p>
                    </Card>
                    <Card title="Risk Management">
                        <p>Advanced AI-powered risk assessment and fraud detection systems.</p>
                    </Card>
                    <Card title="Investment Analytics">
                        <p>Comprehensive market analysis and investment tracking tools.</p>
                    </Card>
                    <Card title="Regulatory Compliance">
                        <p>Automated compliance monitoring and reporting for financial regulations.</p>
                    </Card>
                </div>
            </section>
            
            {!!ctx && (
                <section className="flex flex-col gap-4">
                    <Markdown content={contextExplainer} />
                    <RuntimeContextCard />
                </section>
            )}
            
            <section className="flex flex-col gap-4">
                <Markdown content={preDynamicContentExplainer} />
                <RandomQuote />
                <Markdown content={postDynamicContentExplainer} />
            </section>
            
            <section id="contact" className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold">Ready to Transform Your Financial Operations?</h2>
                <p className="text-lg">Join hundreds of companies that trust The Real Fintech for their financial technology needs.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="mailto:hello@therealfintech.com" className="btn btn-lg">
                        Contact Sales
                    </Link>
                    <Link href="#demo" className="btn btn-lg btn-outline">
                        Request Demo
                    </Link>
                </div>
            </section>
        </div>
    );
}

function RuntimeContextCard() {
    const title = `Environment: running in ${ctx} mode.`;
    if (ctx === 'dev') {
        return (
            <Card title={title}>
                <p>Development environment - real-time updates and debugging enabled.</p>
            </Card>
        );
    } else {
        return (
            <Card title={title}>
                <p>Production environment - optimized for performance and security.</p>
            </Card>
        );
    }
}
