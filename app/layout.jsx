import '../styles/globals.css';

export const metadata = {
    title: {
        template: '%s | The Real Mafias',
        default: 'The Real Mafias - Premium Real Estate'
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.svg" sizes="any" />
            </head>
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
