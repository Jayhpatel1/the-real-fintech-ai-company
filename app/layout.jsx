import '../styles/globals.css';
import { Footer } from '../components/footer';
import { Header } from '../components/header';

export const metadata = {
    title: {
        template: '%s | RealFinTech',
        default: 'RealFinTech - Innovative Financial Technology Solutions'
    },
    description: 'RealFinTech provides cutting-edge financial technology solutions for modern businesses. Discover our innovative fintech platform and services.',
    keywords: 'fintech, financial technology, digital banking, payment solutions, financial services',
    authors: [{ name: 'RealFinTech Team' }],
    openGraph: {
        title: 'RealFinTech - Innovative Financial Technology Solutions',
        description: 'Cutting-edge financial technology solutions for modern businesses',
        url: 'https://therealfintech.com',
        siteName: 'RealFinTech',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'RealFinTech - Innovative Financial Technology Solutions',
        description: 'Cutting-edge financial technology solutions for modern businesses',
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.svg" sizes="any" />
            </head>
            <body className="antialiased text-white bg-blue-900">
                <div className="flex flex-col min-h-screen px-6 bg-noise sm:px-12">
                    <div className="flex flex-col w-full max-w-5xl mx-auto grow">
                        <Header />
                        <main className="grow">{children}</main>
                        <Footer />
                    </div>
                </div>
            </body>
        </html>
    );
}
