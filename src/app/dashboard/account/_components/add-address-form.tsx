'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

import { addAddress } from '~/lib/actions/address';
import { catchError } from '~/lib/utils';
import { addAddressSchema } from '~/lib/validations/address';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { LoadingButton } from '~/components/loading-button';

type AddAddressFormProps = {
  onSuccess: () => void;
};

export function AddAddressForm({ onSuccess }: AddAddressFormProps) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof addAddressSchema>>({
    resolver: zodResolver(addAddressSchema),
    defaultValues: {
      address: '',
      state: '',
      city: '',
      postalCode: '',
    },
  });

  function onSubmit({ phone, address, state, city, postalCode }: z.infer<typeof addAddressSchema>) {
    startTransition(async () => {
      try {
        await addAddress({
          address,
          state,
          city,
          postalCode,
          phone,
        });
        onSuccess();
      } catch (error) {
        catchError(error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)} className='space-y-3'>
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem className='space-y-0.5'>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  placeholder='Phone number'
                  type='tel'
                  autoCapitalize='none'
                  autoComplete='off'
                  autoCorrect='off'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem className='space-y-0.5'>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder='Street address'
                  autoCapitalize='none'
                  autoComplete='off'
                  autoCorrect='off'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='state'
          render={({ field }) => (
            <FormItem className='space-y-0.5'>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder='State' autoCapitalize='none' autoComplete='off' autoCorrect='off' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='city'
          render={({ field }) => (
            <FormItem className='space-y-0.5'>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder='City' autoCapitalize='none' autoComplete='off' autoCorrect='off' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='postalCode'
          render={({ field }) => (
            <FormItem className='space-y-0.5'>
              <FormLabel>Zip / Postal Code</FormLabel>
              <FormControl>
                <Input
                  placeholder='Zip / Postal Code'
                  autoCapitalize='none'
                  autoComplete='off'
                  autoCorrect='off'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton className='w-full' isLoading={isPending}>
          Add Address
        </LoadingButton>
      </form>
    </Form>
  );
}
