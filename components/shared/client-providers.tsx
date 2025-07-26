'use client';

import React from 'react';
import useCartSidebar from '@/hooks/use-cart-sidebar';
import CartSiderBar from './cart-sidebar';
import { Toaster } from 'sonner';
import { ThemeProvider } from './theme-provider';

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isCartSidebarOpen = useCartSidebar();
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {isCartSidebarOpen ? (
        <div className="flex min-h-screen">
          <div className="flex-1 overflow-hidden">{children}</div>
          <CartSiderBar />
        </div>
      ) : (
        <div>{children}</div>
      )}
      <Toaster />
    </ThemeProvider>

    // <>
    //   {isCartSidebarOpen ? (
    //     <div className="flex min-h-screen">
    //       <div className="flex-1 overflow-hidden">{children}</div>
    //       <CartSiderBar />
    //     </div>
    //   ) : (
    //     <div>{children}</div>
    //   )}
    //   <Toaster />
    // </>
  );
}
