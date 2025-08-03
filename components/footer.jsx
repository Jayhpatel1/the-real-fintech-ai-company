import Link from 'next/link';

export function Footer() {
    return (
        <footer className="pt-16 pb-12 sm:pt-24 sm:pb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4">RealFinTech</h3>
                    <p className="text-sm text-gray-300">
                        Innovative financial technology solutions for modern businesses.
                    </p>
                </div>
                <div>
                    <h4 className="text-md font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/services" className="hover:text-green-400 transition-colors">Services</Link></li>
                        <li><Link href="/about" className="hover:text-green-400 transition-colors">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-green-400 transition-colors">Contact</Link></li>
                        <li><Link href="/blog" className="hover:text-green-400 transition-colors">Blog</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-md font-semibold mb-4">Contact</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li>Email: info@therealfintech.com</li>
                        <li>Phone: +1 (555) 123-4567</li>
                        <li>Address: 123 FinTech Ave, Digital City</li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
                <p>&copy; 2024 RealFinTech. All rights reserved.</p>
            </div>
        </footer>
    );
}
