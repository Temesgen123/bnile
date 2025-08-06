import * as React from 'react';
import Link from 'next/link';
import { X, ChevronRight, UserCircle, MenuIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SignOut } from '@/lib/actions/user.actions';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { auth } from '@/auth';

export default async function Sidebar({
  categories,
}: {
  categories: string[];
}) {
  const session = await auth();
  return (
    <Drawer direction="left">
      <DrawerTrigger className="header-button flex items-center !p-5 text-white bg-[#000059]">
        <MenuIcon className="h-5 w-5 mr-1" />
        All
      </DrawerTrigger>
      <DrawerContent className="w-[350px] mt-0 top-0 text-white bg-[#000059] !p-5">
        <div className="flex flex-col h-full">
          {
            //   User Signin Section
          }
          <div className="dark bg-gray-800 text-foreground flex items-center justify-between">
            <DrawerHeader>
              <DrawerTitle className="flex items-center">
                <UserCircle className="w-6 h-6 mr-2" />
                {session ? (
                  <DrawerClose asChild>
                    <Link href="/account">
                      <span>Hello, {session.user.name}</span>
                    </Link>
                  </DrawerClose>
                ) : (
                  <DrawerClose asChild>
                    <Link href="/sign-in">
                      <span className="text-lg font-semibold">
                        Hello, signin
                      </span>
                    </Link>
                  </DrawerClose>
                )}
              </DrawerTitle>
              <DrawerDescription></DrawerDescription>
            </DrawerHeader>
            <DrawerClose asChild>
              <Button variant="ghost" className="mr-2" size="icon">
                <X className="w-5 h-5" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </div>
          {/* Shop  by Category */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b ">
              <h2 className="text-lg font-semibold">Shop By Department</h2>
            </div>
            <nav className="flex flex-col">
              {categories.map((category) => (
                <DrawerClose asChild key={category}>
                  <Link
                    href={`/search?category=${category}`}
                    className="flex items-center justify-between item-button"
                  >
                    <span>{category}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </DrawerClose>
              ))}
            </nav>
          </div>
          {/* Settings and help */}
          <div className="border-t flex flex-col ">
            <div className="p-4">
              <h2 className="text-lg font-semibold">Help and settings</h2>
            </div>
            <DrawerClose asChild>
              <Link href="/account" className="item-button">
                Your Account
              </Link>
            </DrawerClose>{' '}
            <DrawerClose asChild>
              <Link href="/page/customer-service" className="item-button">
                Customer Service
              </Link>
            </DrawerClose>
            {session ? (
              <form action={SignOut} className="w-full">
                <Button
                  className="w-full justify-start item-button text-base"
                  variant="ghost"
                >
                  Sign Out
                </Button>
              </form>
            ) : (
              <Link href="/sign-in" className="item-button">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
