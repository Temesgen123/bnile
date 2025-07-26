import CartButton from './cart-button';
import UserButton from './user-button';

import { EllipsisVertical } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import ThemeSwitcher from './theme-switcher';

export default function Menu() {
  return (
    <div className="flex justify-end">
      <nav className="hidden md:flex gap-3 w-full">
        <ThemeSwitcher />
        <UserButton />
        <CartButton />
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle header-button">
            <EllipsisVertical className="w-6 h-6" />
          </SheetTrigger>
          <SheetContent className="bg-black text-white flex flex-col items-start">
            <SheetHeader className="w-full">
              <div className="flex items-center justify-between">
                <SheetTitle>Site Menu</SheetTitle>
                <SheetDescription></SheetDescription>
              </div>
            </SheetHeader>
            <ThemeSwitcher />
            <UserButton />
            <CartButton />
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );

  // return (
  //   <div className="flex justify-end">
  //     <nav className="hidden md:flex gap-3 w-full">
  //       <UserButton />
  //       <CartButton />
  //     </nav>
  //   </div>
  // );
}
