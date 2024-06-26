'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

import { checkCouponCode } from '~/lib/actions/coupon';
import { payment } from '~/lib/actions/payment';
import { catchError } from '~/lib/utils';
import { paymentSchema } from '~/lib/validations/payment';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { toast } from '~/components/ui/toaster';
import { LoadingButton } from '~/components/loading-button';

type PaymentFormProps = {
  orderCode: string;
};

export function PaymentForm({ orderCode }: PaymentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [couponCode, setCouponCode] = React.useState('');

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      name: '',
      card: '',
      cvc: '',
      expiry: '',
      orderCode,
    },
  });

  function onSubmit(input: z.infer<typeof paymentSchema>) {
    startTransition(async () => {
      try {
        await payment(input);
        void router.replace('/thank-you');
      } catch (error) {
        catchError(error);
      }
    });
  }

  return (
    <div className='space-y-6'>
      <form
        onSubmit={async e => {
          e.preventDefault();
          const coupon = await checkCouponCode(couponCode);
          if (!coupon) {
            toast.error('Invalid or expired discount code');
          }
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Apply Discount Code</CardTitle>
          </CardHeader>
          <CardContent className='flex space-x-2'>
            <Input
              name='couponCode'
              placeholder='Enter Discount Code'
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
              required
            />
            <LoadingButton isLoading={isPending} className='ml-auto'>
              Apply
            </LoadingButton>
          </CardContent>
        </Card>
      </form>
      <Form {...form}>
        <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)} className='space-y-3'>
          <Card>
            <CardHeader>
              <CardTitle>Pay by Card</CardTitle>
              <CardDescription>Enter your card information.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Name on card' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='card'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card</FormLabel>
                    <FormControl>
                      <Input placeholder='16 Digit Card Number' inputMode='numeric' pattern='[0-9]{16}' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 gap-2'>
                <FormField
                  control={form.control}
                  name='expiry'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry</FormLabel>
                      <FormControl>
                        <Input placeholder='MMYY' inputMode='numeric' pattern='[0-9]{4}' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='cvc'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVC</FormLabel>
                      <FormControl>
                        <Input placeholder='CVC' inputMode='numeric' pattern='[0-9]{3}' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <LoadingButton isLoading={isPending} className='ml-auto' type='submit'>
                Submit
              </LoadingButton>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
