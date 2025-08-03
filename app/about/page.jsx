import { Card } from 'components/card';
import { Markdown } from 'components/markdown';

const aboutContent = `
# About RealFinTech

Founded in 2020, RealFinTech has been at the forefront of financial technology innovation, helping businesses of all sizes navigate the complex world of digital finance.

## Our Mission

To democratize access to advanced financial technology by providing scalable, secure, and innovative solutions that empower businesses to thrive in the digital economy.

## Our Vision

To be the leading platform for financial technology solutions, making advanced fintech capabilities accessible to businesses worldwide.
`;

const values = [
    {
        title: "Innovation",
        description: "We constantly push the boundaries of what's possible in financial technology, staying ahead of industry trends and emerging technologies."
    },
    {
        title: "Security",
        description: "Security is at the core of everything we do. We implement enterprise-grade security measures to protect your financial data."
    },
    {
        title: "Reliability",
        description: "Our platform is built for reliability and scalability, ensuring your business can grow with confidence."
    },
    {
        title: "Customer Success",
        description: "Your success is our success. We're committed to providing exceptional support and ensuring you achieve your goals."
    }
];

const team = [
    {
        name: "Sarah Johnson",
        role: "CEO & Founder",
        description: "Former VP of Engineering at a major fintech company with 15+ years of experience in financial technology."
    },
    {
        name: "Michael Chen",
        role: "CTO",
        description: "Expert in scalable architecture and financial systems with a background in leading engineering teams."
    },
    {
        name: "Emily Rodriguez",
        role: "Head of Product",
        description: "Product strategist with deep expertise in fintech user experience and regulatory compliance."
    },
    {
        name: "David Kim",
        role: "Head of Security",
        description: "Cybersecurity expert specializing in financial data protection and regulatory compliance."
    }
];

export default function AboutPage() {
    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <section>
                <h1 className="mb-4 text-4xl font-bold">About Us</h1>
                <Markdown content={aboutContent} />
            </section>

            <section>
                <h2 className="text-3xl font-bold mb-8">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {values.map((value, index) => (
                        <Card key={index} title={value.title}>
                            <p>{value.description}</p>
                        </Card>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-3xl font-bold mb-8">Our Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {team.map((member, index) => (
                        <Card key={index} title={member.name}>
                            <p className="text-green-400 font-semibold mb-2">{member.role}</p>
                            <p>{member.description}</p>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="bg-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                <div className="space-y-4 text-gray-300">
                    <p>
                        RealFinTech was born from a simple observation: while large financial institutions had access to cutting-edge technology, 
                        smaller businesses and startups were struggling to compete in an increasingly digital financial landscape.
                    </p>
                    <p>
                        Our founders, having worked in both traditional banking and fintech startups, recognized the need for a platform that 
                        could democratize access to advanced financial technology. They envisioned a solution that would be both powerful enough 
                        for enterprise use cases and accessible enough for growing businesses.
                    </p>
                    <p>
                        Today, RealFinTech serves hundreds of businesses worldwide, from innovative fintech startups to established financial 
                        institutions, helping them leverage the power of modern financial technology to grow and succeed.
                    </p>
                </div>
            </section>

            <section className="bg-green-600 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Join Us in Shaping the Future of Finance</h2>
                <p className="mb-6">Ready to transform your business with innovative financial technology solutions?</p>
                <a href="/contact" className="btn btn-lg bg-white text-green-600 hover:bg-gray-100">
                    Get Started Today
                </a>
            </section>
        </div>
    );
}