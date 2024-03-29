import { type Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getUser } from '~/lib/auth';
import { getCartItems } from '~/lib/fetchers/cart';
import { formatPrice } from '~/lib/utils';
import { buttonVariants } from '~/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { CartItems } from '~/components/checkout/cart-items';
import { PageHeader } from '~/components/page-header';

export const metadata: Metadata = {
  title: 'Checkout',
};

export default async function CartPage() {
  const user = await getUser();
  const cart = await getCartItems();

  if (!user) {
    redirect('/signin');
  }

  return (
    <div className='container grid items-center gap-8 pb-8 pt-6 md:py-8'>
      <PageHeader title='Checkout' description='Checkout with your cart items' className='mb-0' />
      <Card>
        <CardHeader className='flex flex-row items-center space-x-4 py-4'>
          <CardTitle className='line-clamp-1 flex-1'>Your Cart</CardTitle>
          <Link
            aria-label='Checkout'
            href='/checkout'
            className={buttonVariants({
              size: 'sm',
            })}
          >
            Checkout
          </Link>
        </CardHeader>
        <Separator className='mb-4' />
        <CardContent className='pb-6 pl-6 pr-0'>
          <CartItems items={cart} className='max-h-[280px]' />
        </CardContent>
        <Separator className='mb-4' />
        <CardFooter className='space-x-4'>
          <span className='flex-1'>Total ({cart.reduce((acc, item) => acc + (item.quantity ?? 0), 0)})</span>
          <span>
            {formatPrice(
              cart?.reduce((total, item) => total + (item.quantity ?? 0) * (item.productStock?.price ?? 0), 0) ?? 0
            )}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
