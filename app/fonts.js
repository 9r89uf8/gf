import { Inter } from 'next/font/google';

export const inter = Inter({
    subsets: ['latin'],          // Spanish chars are in 'latin'
    display: 'swap',             // paints with fallback immediately
    adjustFontFallback: true,    // metrics matching -> fewer reflows
    weight: ['400', '500', '600', '800'], // you use 500/600/800 in hero
});
