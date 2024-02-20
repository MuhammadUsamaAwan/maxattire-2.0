'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { JWTPayload } from '~/types';
import { updateUser } from '~/lib/actions/user';
import { catchError } from '~/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { LoadingButton } from '~/components/loading-button';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
});

type UpdateAccountFormProps = {
  user: JWTPayload;
};

export function UpdateAccountForm({ user }: UpdateAccountFormProps) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name ?? '',
    },
  });

  function onSubmit({ name }: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        await updateUser({ name });
      } catch (error) {
        catchError(error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)} className='px-1'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='space-y-0.5'>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Name' autoCapitalize='none' autoComplete='off' autoCorrect='off' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton className='mt-4 w-full' isLoading={isPending}>
          Update Account
        </LoadingButton>
      </form>
    </Form>
  );
}
