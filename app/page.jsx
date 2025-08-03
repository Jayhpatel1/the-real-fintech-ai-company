import Link from 'next/link';

export default function Page() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="hero-gradient relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative container section">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="mb-8">
                            <h1 className="hero-text mb-6 fade-in">
                                Construction to Demolition - 
                                <br />
                                <span className="text-secondary">Everything App for</span>
                                <br />
                                Complete Real Estate Solutions
                            </h1>
                            <p className="hero-text text-large mb-8 max-w-3xl mx-auto slide-up">
                                Buy, sell, rent properties at zero brokerage | Premium deals at 1%
                            </p>
                            <p className="hero-text text-base mb-12 max-w-2xl mx-auto opacity-90">
                                Complete real estate ecosystem with AI voice search, smart contracts, 
                                blockchain payments, and advanced analytics
                            </p>
                        </div>

                        {/* AI Search Box */}
                        <div className="search-box mb-12">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="🎤 AI-Powered Search: Try 'luxury penthouses in downtown'"
                                    className="search-input"
                                />
                                <button className="search-btn">
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link href="/properties" className="btn-primary btn-xl">
                                Explore Properties
                            </Link>
                            <Link href="/services" className="btn-secondary btn-xl">
                                Our Services
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Coming Soon Badge */}
                <div className="absolute top-20 right-4 md:top-32 md:right-12">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                        <div className="text-2xl md:text-3xl font-bold text-white mb-2">Coming</div>
                        <div className="text-2xl md:text-3xl font-bold text-secondary mb-2">Soon</div>
                        <div className="text-sm text-white/80">In Every City</div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="section bg-gray-50">
                <div className="container">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="stats-card">
                            <div className="stats-number">25K+</div>
                            <div className="stats-label">Premium Properties</div>
                        </div>
                        <div className="stats-card">
                            <div className="stats-number">15K+</div>
                            <div className="stats-label">Luxury Products</div>
                        </div>
                        <div className="stats-card">
                            <div className="stats-number">8K+</div>
                            <div className="stats-label">Elite Services</div>
                        </div>
                        <div className="stats-card">
                            <div className="stats-number">24/7</div>
                            <div className="stats-label">VIP Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2 className="text-gradient mb-6">Premium Real Estate at Zero Brokerage</h2>
                        <p className="text-large text-gray-600 max-w-3xl mx-auto">
                            Exclusive luxury properties • AI-powered search • Complete real estate ecosystem • Premium deals at 1%
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="card text-center">
                            <div className="feature-icon">🏠</div>
                            <h3 className="mb-4">Luxury Properties</h3>
                            <p className="text-gray-600">
                                Exclusive access to premium properties with zero brokerage fees and transparent pricing.
                            </p>
                        </div>
                        
                        <div className="card text-center">
                            <div className="feature-icon">🎤</div>
                            <h3 className="mb-4">AI Voice Search</h3>
                            <p className="text-gray-600">
                                Advanced AI-powered search with voice commands to find your perfect property instantly.
                            </p>
                        </div>
                        
                        <div className="card text-center">
                            <div className="feature-icon">⛓️</div>
                            <h3 className="mb-4">Blockchain Payments</h3>
                            <p className="text-gray-600">
                                Secure, transparent transactions with smart contracts and blockchain technology.
                            </p>
                        </div>
                        
                        <div className="card text-center">
                            <div className="feature-icon">📊</div>
                            <h3 className="mb-4">Advanced Analytics</h3>
                            <p className="text-gray-600">
                                Real-time market insights and property analytics to make informed decisions.
                            </p>
                        </div>
                        
                        <div className="card text-center">
                            <div className="feature-icon">💎</div>
                            <h3 className="mb-4">Premium Deals</h3>
                            <p className="text-gray-600">
                                Exclusive deals at just 1% with access to off-market luxury properties.
                            </p>
                        </div>
                        
                        <div className="card text-center">
                            <div className="feature-icon">🔒</div>
                            <h3 className="mb-4">Complete Ecosystem</h3>
                            <p className="text-gray-600">
                                End-to-end real estate solutions from construction to demolition services.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="primary-gradient section">
                <div className="container text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-white mb-6">Ready to Transform Your Real Estate Experience?</h2>
                        <p className="text-white/90 text-large mb-8">
                            Join thousands of satisfied customers who have found their dream properties with zero hassle and premium service.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/properties" className="btn-secondary btn-lg">
                                Browse Properties
                            </Link>
                            <Link href="/contact" className="btn btn-lg bg-white/20 text-white border-2 border-white hover:bg-white hover:text-primary">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
