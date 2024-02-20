import { type Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getUser } from '~/lib/auth';
import { getAddresses } from '~/lib/fetchers/address';
import { getCartItems } from '~/lib/fetchers/cart';
import { formatPrice } from '~/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { CartItems } from '~/components/checkout/cart-items';
import { PageHeader } from '~/components/page-header';

import { OrderConfirmForm } from './_components/order-confirm-form';

export const metadata: Metadata = {
  title: 'Confrim Order',
};

export default async function CheckoutPage() {
  const cart = await getCartItems();
  const addresses = await getAddresses();
  const session = await getUser();

  if (!session) {
    redirect('/signin');
  }

  return (
    <div className='container pb-8 pt-6 md:py-8'>
      <PageHeader title='Confirm Order' description='Enter your information to place your order' />
      <div className='grid gap-8 sm:grid-cols-2'>
        <div>
          <Card>
            <CardHeader className='flex flex-row items-center space-x-4 py-4'>
              <CardTitle className='line-clamp-1 flex-1'>Your Order</CardTitle>
            </CardHeader>
            <Separator className='mb-4' />
            <CardContent className='pb-6 pl-6 pr-0'>
              <CartItems items={cart} className='max-h-[280px]' isEditable={false} />
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
        <OrderConfirmForm session={session} addresses={addresses} />
      </div>
    </div>
  );
}
