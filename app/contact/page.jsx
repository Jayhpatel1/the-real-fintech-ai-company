import { Card } from 'components/card';
import { Markdown } from 'components/markdown';

const contactContent = `
# Get in Touch

Ready to transform your business with innovative financial technology? Our team is here to help you find the perfect solution for your needs.
`;

const contactInfo = [
    {
        title: "Email",
        value: "info@therealfintech.com",
        description: "Send us a message anytime"
    },
    {
        title: "Phone",
        value: "+1 (555) 123-4567",
        description: "Call us during business hours"
    },
    {
        title: "Address",
        value: "123 FinTech Ave, Digital City, DC 12345",
        description: "Visit our headquarters"
    }
];

export default function ContactPage() {
    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <section>
                <h1 className="mb-4 text-4xl font-bold">Contact Us</h1>
                <Markdown content={contactContent} />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="company" className="block text-sm font-medium mb-2">
                                Company
                            </label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400"
                            />
                        </div>
                        <div>
                            <label htmlFor="service" className="block text-sm font-medium mb-2">
                                Service of Interest
                            </label>
                            <select
                                id="service"
                                name="service"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400"
                            >
                                <option value="">Select a service</option>
                                <option value="digital-banking">Digital Banking Solutions</option>
                                <option value="payment-processing">Payment Processing</option>
                                <option value="financial-analytics">Financial Analytics</option>
                                <option value="regulatory-compliance">Regulatory Compliance</option>
                                <option value="api-integration">API Integration</option>
                                <option value="white-label">White-Label Solutions</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={6}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400"
                                placeholder="Tell us about your project and how we can help..."
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            Send Message
                        </button>
                    </form>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                    <div className="space-y-6">
                        {contactInfo.map((info, index) => (
                            <Card key={index} title={info.title}>
                                <p className="text-lg font-semibold mb-2">{info.value}</p>
                                <p className="text-gray-300">{info.description}</p>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-8 bg-gray-800 rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4">Business Hours</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>Monday - Friday: 9:00 AM - 6:00 PM EST</li>
                            <li>Saturday: 10:00 AM - 4:00 PM EST</li>
                            <li>Sunday: Closed</li>
                        </ul>
                        <p className="mt-4 text-sm text-gray-400">
                            For urgent matters outside business hours, please email us and we&apos;ll respond as soon as possible.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}