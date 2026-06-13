import type { Metadata } from 'next';
import { Barlow_Condensed, Archivo, IBM_Plex_Mono, Caveat } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/components/AuthProvider';

const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
});

const body = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

const hand = Caveat({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-hand',
});

export const metadata: Metadata = {
  title: 'GiroSecco — Itinerari moto curati nel Lazio',
  description:
    'Giri in moto veri, provati su strada: curve, soste, trattorie e benzinai. Scarica il GPX e parti.',
  icons: {
    icon: '/favicon-32.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${display.variable} ${body.variable} ${mono.variable} ${hand.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
