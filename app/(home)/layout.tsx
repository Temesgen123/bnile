import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header/index';
import React from 'react';
import { Toaster } from 'sonner';

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col ">
        {children}
        <Toaster richColors />
      </main>
      <Footer />
    </div>
  );
}
