import Link from 'next/link';

export function Footer() {
    return (
        <footer className="pt-16 pb-12 sm:pt-24 sm:pb-16">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <div>
                    <p className="text-lg font-semibold mb-2">The Real Fintech</p>
                    <p className="text-sm text-gray-300">
                        Authentic financial technology solutions for the modern world.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 text-sm">
                    <Link href="/privacy" className="hover:text-primary transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="hover:text-primary transition-colors">
                        Terms of Service
                    </Link>
                    <Link href="mailto:hello@therealfintech.com" className="hover:text-primary transition-colors">
                        Contact Us
                    </Link>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700">
                <p className="text-xs text-gray-400">
                    © 2024 The Real Fintech. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
