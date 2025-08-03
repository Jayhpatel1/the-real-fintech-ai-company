import { Card } from 'components/card';
import { Markdown } from 'components/markdown';

const blogContent = `
# RealFinTech Blog

Stay updated with the latest insights, trends, and innovations in the financial technology industry.
`;

const blogPosts = [
    {
        title: "The Future of Digital Banking in 2024",
        excerpt: "Explore the key trends shaping the digital banking landscape and how businesses can prepare for the future of financial services.",
        date: "December 15, 2024",
        category: "Digital Banking",
        readTime: "5 min read"
    },
    {
        title: "AI-Powered Financial Analytics: Transforming Decision Making",
        excerpt: "Discover how artificial intelligence is revolutionizing financial analytics and helping businesses make better, data-driven decisions.",
        date: "December 10, 2024",
        category: "Analytics",
        readTime: "7 min read"
    },
    {
        title: "Regulatory Compliance in the Digital Age",
        excerpt: "Learn about the evolving regulatory landscape and how fintech companies can stay compliant while innovating rapidly.",
        date: "December 5, 2024",
        category: "Compliance",
        readTime: "6 min read"
    },
    {
        title: "Building Secure Payment Systems: Best Practices",
        excerpt: "Essential security practices for building robust and secure payment processing systems that protect customer data.",
        date: "November 30, 2024",
        category: "Security",
        readTime: "8 min read"
    },
    {
        title: "The Rise of Embedded Finance: Opportunities and Challenges",
        excerpt: "How embedded finance is reshaping the financial services industry and creating new opportunities for businesses.",
        date: "November 25, 2024",
        category: "Innovation",
        readTime: "6 min read"
    },
    {
        title: "API-First Approach: The Key to Scalable Fintech Solutions",
        excerpt: "Why an API-first approach is crucial for building scalable financial technology solutions that can grow with your business.",
        date: "November 20, 2024",
        category: "Technology",
        readTime: "5 min read"
    }
];

const categories = [
    "All",
    "Digital Banking",
    "Analytics",
    "Compliance",
    "Security",
    "Innovation",
    "Technology"
];

export default function BlogPage() {
    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <section>
                <h1 className="mb-4 text-4xl font-bold">Blog</h1>
                <Markdown content={blogContent} />
            </section>

            <section>
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                category === "All" 
                                    ? "bg-green-600 text-white" 
                                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post, index) => (
                        <Card key={index} title={post.title}>
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                                <span>{post.date}</span>
                                <span>•</span>
                                <span>{post.readTime}</span>
                            </div>
                            <p className="text-gray-300 mb-4">{post.excerpt}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-green-400 text-sm font-medium">{post.category}</span>
                                <a href="#" className="text-green-400 hover:text-green-300 text-sm font-medium">
                                    Read More →
                                </a>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="bg-gray-800 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
                <p className="mb-6">Subscribe to our newsletter for the latest insights and updates from the fintech world.</p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400"
                    />
                    <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
                        Subscribe
                    </button>
                </div>
            </section>
        </div>
    );
}