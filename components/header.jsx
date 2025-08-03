import Link from 'next/link';

const navItems = [
    { linkText: 'Home', href: '/' },
    { linkText: 'Services', href: '/services' },
    { linkText: 'About', href: '/about' },
    { linkText: 'Contact', href: '/contact' },
    { linkText: 'Blog', href: '/blog' }
];

export function Header() {
    return (
        <nav className="flex flex-wrap items-center gap-4 pt-6 pb-12 sm:pt-12 md:pb-24">
            <Link href="/" className="text-2xl font-bold text-white hover:text-green-400 transition-colors">
                RealFinTech
            </Link>
            {!!navItems?.length && (
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <Link href={item.href} className="inline-flex px-1.5 py-1 sm:px-3 sm:py-2 hover:text-green-400 transition-colors">
                                {item.linkText}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            <Link
                href="/contact"
                className="hidden lg:inline-flex lg:ml-auto bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
            >
                Get Started
            </Link>
        </nav>
    );
}
