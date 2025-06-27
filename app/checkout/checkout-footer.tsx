import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';
import React from 'react';

export default function CheckoutFooter() {
  return (
    <div className="border-t-2 space-y-2 my-4 py-4 ">
      <p>
        Need help? Check our <Link href="/page/help">Help center</Link> or{' '}
        <Link href="/page/contact-us">Contact us</Link>{' '}
      </p>
      <p>
        For an item orderd form {APP_NAME}: when you click the &apos;Place Your
        Order&apos; button, we will send you an e-mail acknowledging receit of
        your order. Your contact to purchase an item will not be complete until
        we send you an e-mail notifying yopu that the item has been shipped to
        you. By placing your order, you agree to {APP_NAME}&apos;s{' '}
        <Link href="/page/privacy-policy">privacy notice</Link>and{' '}
        <Link href="/page/condition-of-use">condition of use</Link>
      </p>
      <p>
        Within 30 days of delivery, you may return new, unopened merchandise in
        its original condition. Exceptions and restriction apply.{' '}
        <Link href="/page/returns-policy">
          See {APP_NAME}&apos;s returns policy.
        </Link>
      </p>
    </div>
  );
}
