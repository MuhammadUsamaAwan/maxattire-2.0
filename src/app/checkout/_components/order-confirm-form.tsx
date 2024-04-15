'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddAddressForm } from '~/app/dashboard/account/_components/add-address-form';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

import type { Addresses, JWTPayload } from '~/types';
import { createOrder } from '~/lib/actions/order';
import { updateUser } from '~/lib/actions/user';
import { catchError } from '~/lib/utils';
import { confirmOrderSchema } from '~/lib/validations/order';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { LoadingButton } from '~/components/loading-button';

type OrderConfirmFormProps = {
  session: JWTPayload;
  addresses: Addresses;
};

export function OrderConfirmForm({ session, addresses }: OrderConfirmFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const form = useForm<z.infer<typeof confirmOrderSchema>>({
    resolver: zodResolver(confirmOrderSchema),
    defaultValues: {
      name: session.name ?? '',
      shippingAddress: '',
      billingAddress: '',
    },
  });

  function onSubmit({ name, shippingAddress, billingAddress }: z.infer<typeof confirmOrderSchema>) {
    startTransition(async () => {
      try {
        if (name !== session.name) {
          await updateUser({ name });
        }
        const orderCode = await createOrder({
          shippingAddressId: Number(shippingAddress),
          billingAddressId: Number(billingAddress),
        });
        router.push(`/payment/${orderCode}`);
      } catch (error) {
        catchError(error);
      }
    });
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)} className='space-y-3'>
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

          <FormField
            control={form.control}
            name='shippingAddress'
            render={({ field }) => (
              <FormItem className='space-y-0.5'>
                <FormLabel>Shipping Address</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select address' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {addresses.map(address => (
                      <SelectItem key={address.id} value={String(address.id)}>
                        {address.address} - {address.city} - {address.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='billingAddress'
            render={({ field }) => (
              <FormItem className='space-y-0.5'>
                <FormLabel>Billing Address</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select address' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {addresses.map(address => (
                      <SelectItem key={address.id} value={String(address.id)}>
                        {address.address} - {address.city} - {address.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant='secondary' type='button' className='w-full' onClick={() => setIsModalOpen(true)}>
            Add Address
          </Button>
          <LoadingButton className='w-full' isLoading={isPending}>
            Confirm Order
          </LoadingButton>
        </form>
      </Form>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Address</DialogTitle>
          </DialogHeader>
          <AddAddressForm onSuccess={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
