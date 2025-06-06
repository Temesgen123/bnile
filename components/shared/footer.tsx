'use client';
import { ChevronUp} from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-[#00004d] text-white underline-link">
      <div className="w-full ">
        <Button
          variant="ghost"
          className="bg-[#000059] w-full rounded-none"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className="mr-2 w-4 h-4" />
          Back to top
        </Button>
      </div>
      <div className="p-4">
        <div className="flex justify-center gap-3 text-sm">
          <Link href="/page/conditions-of-use">Conditions of Use</Link>
          <Link href="/page/privacy-policy">Privacy Notice</Link>
          <Link href="/page/help">Help</Link>
        </div>
        <div className="flex justify-center text-sm">
          <p> &#169; 2000-2025 {APP_NAME} Inc.</p>
        </div>
        <div className="mt-8 flex justify-center text-sm text-gray-400">
          1003 Churchill Road, Addis Ababa, Ethiopia  | +251 91 999 3333     
        </div>
      </div>
    </footer>
  );
}
