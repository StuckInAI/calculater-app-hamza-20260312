import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Calculator App',
  description: 'A fullstack calculator with history',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">🧮 Calculator</h1>
            <div className="flex gap-4">
              <a
                href="/"
                className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                Calculator
              </a>
              <a
                href="/history"
                className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                History
              </a>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
