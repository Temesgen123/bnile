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
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { IUserSignUp } from '@/types';
import {
  registerUser,
  SignInWithCredentials,
} from '@/lib/actions/user.actions';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSignUpSchema } from '@/lib/validator';
import { Separator } from '@radix-ui/react-separator';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { APP_NAME } from '@/lib/constants';

const signUpDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        name: 'john doe',
        email: 'john@me.com',
        password: '12345',
        confirmPassword: '12345',
      }
    : { name: '', email: '', password: '', confirmPassword: '' };
export default function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const form = useForm<IUserSignUp>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: signUpDefaultValues,
  });
  const { control, handleSubmit } = form;

  const onSubmit = async (data: IUserSignUp) => {
    try {
      const res = await registerUser(data);
      if (!res.success) {
        toast.error(`Error: ${res.error}`, { description: res.error });
        return;
      }
      await SignInWithCredentials({
        email: data.email,
        password: data.password,
      });
      redirect(callbackUrl);
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
      toast.error('Invalid email or password.', {
        description: 'Invalid Email or Password.',
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name:</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name address" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password:</FormLabel>
                <FormControl>
                  <Input placeholder="Enter password." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Confirm Password:</FormLabel>
                <FormControl>
                  <Input placeholder="Enter password." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div>
            <Button type="submit">Sign Up</Button>
          </div>
          <div className="text-sm">
            By creating an account, you agree to {APP_NAME}&apos;s{' '}
            <Link href="/page/conditions-of-use">Conditions of Use</Link>
            <Link href="/page/privacy-policy">Privacy Notice</Link>
          </div>
          <Separator className="mb-4" />
          <div className="text-sm">
            Already have an account?{' '}
            <Link className="link" href={`/sign-in?callbackUrl=${callbackUrl}`}>
              Sign In
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
