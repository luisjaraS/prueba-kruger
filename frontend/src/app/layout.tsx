import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ReactQueryProvider } from '@/lib/react-query-provider';
import { AuthInitializer } from '@/components/auth/auth-initializer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Task Manager',
  description:
    'Modern Next.js application with primitives, forms, and data tables',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <ReactQueryProvider>
          <AuthInitializer>{children}</AuthInitializer>
          <Toaster richColors position="top-right" duration={3000} />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
