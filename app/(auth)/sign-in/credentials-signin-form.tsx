'use client';

import { redirect, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { IUserSignIn } from '@/types';
import { SignInWithCredentials } from '@/lib/actions/user.actions';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSignInSchema } from '@/lib/validator';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { APP_NAME } from '@/lib/constants';

const signInDefaultValue =
  process.env.NODE_ENV === 'development'
    ? { email: 'admin@example.com', password: '12345' }
    : { email: '', password: '' };

export default function CredentilasSignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const form = useForm<IUserSignIn>({
    resolver: zodResolver(UserSignInSchema),
    defaultValues: signInDefaultValue,
  });

  const { control, handleSubmit } = form;
  const onSubmit = async (data: IUserSignIn) => {
    try {
      await SignInWithCredentials({
        email: data.email,
        password: data.password,
      });
      redirect(callbackUrl);
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
      toast.error('Error: Invalid email or password.', {
        description: 'Invalid email or password',
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Email Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter Password"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div>
            <Button type="submit">Sign In </Button>
          </div>
          <div className="text-sm">
            By signing in, you agree to {APP_NAME}&apos;s{' '}
            <Link href="/page/conditions-of-use">Conditions of use{' '}</Link>and
            {' '}
            <Link href="/page/privacy-policy">Privacy Notice.</Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
