import { Card } from 'components/card';
import { Markdown } from 'components/markdown';

const servicesContent = `
# Our Services

RealFinTech provides comprehensive financial technology solutions designed to help businesses thrive in the digital economy. Our platform combines cutting-edge technology with industry expertise to deliver results that matter.
`;

const services = [
    {
        title: "Digital Banking Solutions",
        description: "Complete digital banking infrastructure for modern financial institutions. From account management to transaction processing, we provide the foundation for next-generation banking.",
        features: ["Multi-currency accounts", "Real-time transactions", "Advanced security", "Mobile-first design"]
    },
    {
        title: "Payment Processing",
        description: "Secure, fast, and reliable payment processing for businesses of all sizes. Support for multiple payment methods and global reach.",
        features: ["Credit/Debit cards", "Digital wallets", "Bank transfers", "Cryptocurrency"]
    },
    {
        title: "Financial Analytics",
        description: "AI-powered insights to drive better financial decisions and growth. Advanced analytics and reporting tools for comprehensive financial intelligence.",
        features: ["Predictive analytics", "Real-time reporting", "Custom dashboards", "Risk assessment"]
    },
    {
        title: "Regulatory Compliance",
        description: "Automated compliance and risk management solutions. Stay compliant with evolving financial regulations with our intelligent compliance platform.",
        features: ["KYC/AML automation", "Regulatory reporting", "Audit trails", "Compliance monitoring"]
    },
    {
        title: "API Integration",
        description: "Seamless integration with existing financial systems. Our robust APIs enable easy connectivity with your current infrastructure.",
        features: ["RESTful APIs", "Webhook support", "SDK libraries", "Developer portal"]
    },
    {
        title: "White-Label Solutions",
        description: "Customizable fintech solutions that you can brand as your own. Launch your own financial services platform with our proven technology.",
        features: ["Custom branding", "Flexible deployment", "Scalable architecture", "24/7 support"]
    }
];

export default function ServicesPage() {
    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <section>
                <h1 className="mb-4 text-4xl font-bold">Services</h1>
                <Markdown content={servicesContent} />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <Card key={index} title={service.title}>
                        <p className="mb-4">{service.description}</p>
                        <ul className="space-y-2">
                            {service.features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-center">
                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </Card>
                ))}
            </section>

            <section className="bg-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="mb-6">Contact our team to discuss how RealFinTech can help transform your business with innovative financial technology solutions.</p>
                <a href="/contact" className="btn btn-lg bg-green-600 hover:bg-green-700">
                    Contact Us
                </a>
            </section>
        </div>
    );
}