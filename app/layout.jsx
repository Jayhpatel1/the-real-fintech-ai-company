import '../styles/globals.css';
import { Footer } from '../components/footer';
import { Header } from '../components/header';

export const metadata = {
    title: {
        template: '%s | The Real Mafias',
        default: 'The Real Mafias - Premium Real Estate at Zero Brokerage'
    },
    description: 'Complete real estate ecosystem with AI voice search, smart contracts, blockchain payments, and advanced analytics. Buy, sell, rent properties at zero brokerage with premium deals at 1%.',
    keywords: 'real estate, zero brokerage, premium properties, luxury homes, AI search, blockchain payments'
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.svg" sizes="any" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            </head>
            <body className="antialiased">
                <div className="min-h-screen">
                    <Header />
                    <main>{children}</main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
