'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';

import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { updateUserName } from '@/lib/actions/user.actions';
import { UserNameSchema } from '@/lib/validator';

export const ProfileForm = () => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const form = useForm<z.infer<typeof UserNameSchema>>({
    resolver: zodResolver(UserNameSchema),
    defaultValues: {
      //eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      name: session?.user?.name!,
    },
  });

  async function onSubmit(values: z.infer<typeof UserNameSchema>) {
    const res = await updateUserName(values);
    if (!res.success) return toast('Error!', { description: res.message });
    const { data, message } = res;
    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: data.name,
      },
    };
    await update(newSession);
    toast('Success', {
      description: message,
    });
    router.push('/account/message');
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>New name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? 'Submitting... ' : 'Save change'}
        </Button>
      </form>
    </Form>
  );
};
