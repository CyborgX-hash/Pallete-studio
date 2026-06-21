import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata = {
  title: 'Color Palette Generator — Create Beautiful Color Palettes',
  description:
    'Generate stunning color palettes from any base color, extract colors from images, or explore trending palettes. Free, fast, and fully client-side. Includes WCAG contrast checker and export tools.',
  keywords: [
    'color palette generator',
    'color harmony',
    'image color extractor',
    'WCAG contrast checker',
    'CSS color variables',
    'complementary colors',
    'design tool',
  ],
  openGraph: {
    title: 'Color Palette Generator — Create Beautiful Color Palettes',
    description:
      'Generate stunning color palettes from any base color, extract from images, or explore trending palettes. Free online tool.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}
