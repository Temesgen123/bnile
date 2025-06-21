'use client';

import { ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';
import useIsMounted from '@/hooks/use-is-mounted';
import { cn } from '@/lib/utils';
import useCartStore from '@/hooks/use-cart-store';
import useCartSidebar from '@/hooks/use-cart-sidebar';

export default function CartButton() {
  const isMounted = useIsMounted();
  const {
    cart: { items },
  } = useCartStore();
  const CartAddItemsCount = items.reduce((a, c) => a + c.quantity, 0);
  const isCartSidebarOpen = useCartSidebar();
  return (
    <Link href="/cart" className="px-1 header-button">
      <div className="flex items-end text-xs relative ">
        <ShoppingCartIcon className="h-8 w-8" />
        {isMounted && (
          <span
            className={cn(
              'bg-red-500 px-1 rounded-full text-primary text-xs absolute right-[30px] top-[-1px] z-10 ',
              CartAddItemsCount >= 10 && 'text-sm px-0 p-[1px]'
            )}
          >
            {CartAddItemsCount}
          </span>
        )}
        <span className="font-bold">Cart</span>
        {isCartSidebarOpen && (
          <div
            className={`absolute top-[20px] right-[-16px] rotate-[-90deg] z-10 w-0 h-0 border-1-[7px] border-b-[8px] border-transparent border-b-background `}
          ></div>
        )}
      </div>
    </Link>
  );
}
