import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import Menu from './menu';
import Search from './search';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import data from '@/lib/data';

export default function Header() {
  return (
    <header className="bg-[#00004d] text-white ">
      <div className="px-2">
        <div className="flex items-center justify-between ">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center header-button font-extrabold text-2xl m-1"
            >
              <Image
                src="/icons/logo.svg"
                alt={`${APP_NAME} logo`}
                width={32}
                height={32}
              />
              {APP_NAME}
            </Link>
          </div>
          <div className="hidden md:block flex-1 max-w-xl">
            <Search />
          </div>
          <Menu />
        </div>
        <div className="md:hidden block py-2">
          <Search />
        </div>
      </div>
      <div className="flex items-center px-3 mb-[1px] bg-[#000059] ">
        <Button
          variant="ghost"
          className="dark header-button flex items-center gap-1 text-base [&_svg]:size-6"
        >
          <MenuIcon /> All
        </Button>
        <div>
          {data.headerMenus.map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              className="header-button !p-2"
            >
              {menu.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
