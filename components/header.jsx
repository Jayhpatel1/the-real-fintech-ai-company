import Link from 'next/link';

export function Header() {
    return (
        <header className="navbar">
            <div className="container">
                <nav className="flex items-center justify-between py-4">
                    <Link href="/" className="logo">
                        🏠 The Real Mafias
                    </Link>
                    
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="nav-link">
                            Home
                        </Link>
                        <Link href="/properties" className="nav-link">
                            Properties
                        </Link>
                        <Link href="/products" className="nav-link">
                            Products
                        </Link>
                        <Link href="/services" className="nav-link">
                            Services
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-green-700">AI ACTIVE</span>
                        </div>
                        
                        <button className="md:hidden p-2 text-gray-700 hover:text-primary">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}
