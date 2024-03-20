'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

import { contactUs } from '~/lib/actions/contact';
import { catchError } from '~/lib/utils';
import { contactSchema } from '~/lib/validations/contact';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { LoadingButton } from '~/components/loading-button';

type Inputs = z.infer<typeof contactSchema>;

export function ContactUsForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<Inputs>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  function onSubmit(data: Inputs) {
    startTransition(async () => {
      try {
        await contactUs(data);
        router.push('/');
      } catch (error) {
        catchError(error);
      }
    });
  }

  return (
    <Form {...form}>
      <form className='grid gap-4' onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}>
        <div className='grid grid-cols-2 gap-2'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type='text' placeholder='Your Name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' placeholder='Your email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='subject'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input type='text' placeholder='Your subject' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='message'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder='Your message' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton isLoading={isPending} className='w-full'>
          Send
        </LoadingButton>
      </form>
    </Form>
  );
}
