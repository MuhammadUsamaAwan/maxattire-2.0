'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

import { addReview } from '~/lib/actions/review';
import { catchError } from '~/lib/utils';
import { addReviewSchema } from '~/lib/validations/review';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Icons } from '~/components/icons';
import { LoadingButton } from '~/components/loading-button';

type AddReviewFormProps = {
  productId: number;
  orderProductId: number;
};

export function AddReviewForm({ productId, orderProductId }: AddReviewFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof addReviewSchema>>({
    resolver: zodResolver(addReviewSchema),
    defaultValues: {
      rating: 5,
      review: '',
      orderProductId,
      productId,
    },
  });

  function onSubmit({ rating, review }: z.infer<typeof addReviewSchema>) {
    startTransition(async () => {
      try {
        await addReview({
          rating,
          review,
          productId,
          orderProductId,
        });
        router.push(`/dashboard/orders`);
      } catch (error) {
        catchError(error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)} className='space-y-3 p-1'>
        <FormField
          control={form.control}
          name='rating'
          render={({ field }) => (
            <FormItem className='space-y-0.5'>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className='flex items-center'>
                  <Button
                    variant='outline'
                    size='icon'
                    type='button'
                    className='size-8 rounded-r-none'
                    onClick={() => {
                      const value = form.getValues('rating');
                      if (value > 1) {
                        form.setValue('rating', value - 1);
                      }
                    }}
                  >
                    <Icons.minus className='size-3' />
                  </Button>
                  <Input
                    className='h-8 w-14 rounded-none border-x-0'
                    placeholder='Rating'
                    type='number'
                    inputMode='numeric'
                    min={0}
                    max={5}
                    {...field}
                  />
                  <Button
                    variant='outline'
                    size='icon'
                    type='button'
                    className='size-8 rounded-l-none'
                    onClick={() => {
                      const value = form.getValues('rating');
                      if (value < 5) {
                        form.setValue('rating', value + 1);
                      }
                    }}
                  >
                    <Icons.plus className='size-3' />
                    <span className='sr-only'>Add one item</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='review'
          render={({ field }) => (
            <FormItem className='space-y-0.5'>
              <FormLabel>Review</FormLabel>
              <FormControl>
                <Textarea placeholder='Review' autoCapitalize='none' autoComplete='off' autoCorrect='off' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton className='w-full' isLoading={isPending}>
          Add Review
        </LoadingButton>
      </form>
    </Form>
  );
}
