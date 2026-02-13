import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './utilities.css';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Water Leakage Detection System',
  description: 'Real-time pipeline monitoring and leakage detection.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
