import './globals.css';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { SessionProvider } from '@/components/SessionProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'RentGo Koraput - Tourism Equipment Rental Platform',
  description: 'Rent bikes, tents, cars, and book accommodations in mountain areas of Koraput',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">
        <SessionProvider session={session}>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
