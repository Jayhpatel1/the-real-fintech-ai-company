import Link from 'next/link';
import { Card } from 'components/card';

export default function Page() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-300 to-yellow-300 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <header className="relative bg-white/10 backdrop-blur-sm border-b border-white/20 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-8">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-yellow-400 rounded-xl border-2 border-yellow-500 shadow-lg flex items-center justify-center">
                                    <span className="text-yellow-800 font-bold text-lg">R</span>
                                </div>
                                <span className="text-2xl font-bold text-yellow-400 text-shadow">The Real Mafias</span>
                            </div>
                            <nav className="hidden md:flex space-x-8">
                                <Link href="/" className="text-gray-800 font-semibold hover:text-yellow-600 transition-all duration-200 hover:scale-105">
                                    Home
                                </Link>
                                <Link href="/properties" className="text-gray-800 font-semibold hover:text-yellow-600 transition-all duration-200 hover:scale-105">
                                    Properties
                                </Link>
                                <Link href="/products" className="text-gray-800 font-semibold hover:text-yellow-600 transition-all duration-200 hover:scale-105">
                                    Products
                                </Link>
                                <Link href="/services" className="text-gray-800 font-semibold hover:text-yellow-600 transition-all duration-200 hover:scale-105">
                                    Services
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-yellow-300 rounded-full px-4 py-2 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-white font-bold text-sm">AI ACTIVE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-6xl md:text-8xl font-black text-yellow-400 mb-4 text-shadow-lg tracking-tight">
                        The Real Mafias
                    </h1>
                    <h2 className="text-4xl md:text-6xl font-black text-gray-800 mb-2 text-shadow">
                        Premium Real Estate
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-black text-yellow-400 mb-8 opacity-90 text-shadow">
                        at Zero Brokerage
                    </h3>
                    <p className="text-xl md:text-2xl text-gray-800 max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
                        Exclusive luxury properties • AI-powered search • Complete real estate ecosystem • Premium deals at 1%
                    </p>
                    
                    {/* AI Search Bar */}
                    <div className="max-w-2xl mx-auto mb-16">
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300 hover:scale-105">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="AI-Powered Search: Try 'luxury penthouse in downtown'"
                                    className="flex-1 bg-transparent text-gray-800 placeholder-gray-600 text-xl font-semibold outline-none"
                                />
                                <div className="flex space-x-2">
                                    <div className="w-8 h-8 bg-gray-300 rounded-lg shadow-md"></div>
                                    <div className="w-8 h-8 bg-gray-300 rounded-lg shadow-md"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center group">
                        <div className="text-4xl md:text-6xl font-black text-yellow-400 mb-2 group-hover:scale-110 transition-transform duration-300">25K+</div>
                        <div className="text-gray-800 font-bold text-lg group-hover:text-yellow-600 transition-colors duration-300">PREMIUM PROPERTIES</div>
                    </div>
                    <div className="text-center group">
                        <div className="text-4xl md:text-6xl font-black text-yellow-400 mb-2 group-hover:scale-110 transition-transform duration-300">15K+</div>
                        <div className="text-gray-800 font-bold text-lg group-hover:text-yellow-600 transition-colors duration-300">LUXURY PRODUCTS</div>
                    </div>
                    <div className="text-center group">
                        <div className="text-4xl md:text-6xl font-black text-yellow-400 mb-2 group-hover:scale-110 transition-transform duration-300">8K+</div>
                        <div className="text-gray-800 font-bold text-lg group-hover:text-yellow-600 transition-colors duration-300">ELITE SERVICES</div>
                    </div>
                    <div className="text-center group">
                        <div className="text-4xl md:text-6xl font-black text-yellow-400 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
                        <div className="text-gray-800 font-bold text-lg group-hover:text-yellow-600 transition-colors duration-300">VIP SUPPORT</div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16">
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-xl">
                        Explore Premium Properties
                    </button>
                </div>
            </main>
        </div>
    );
}
