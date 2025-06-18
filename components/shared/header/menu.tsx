
import Link from 'next/link';
import CartButton from './cart-button';

export default function Menu() {
  return (
    <div className="flex justify-end">
      <nav className="flex gap-3 w-full">
        <Link href="/signin" className="flex items-center header-button">
          {/* <UserIcon className="h-6 w-6" /> */}
          <span className="font-bold">Hello, Sign in </span>
        </Link>
        <CartButton />
      </nav>
    </div>
  );
}
