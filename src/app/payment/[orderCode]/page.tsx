import { notFound, redirect } from 'next/navigation';

import { getUser } from '~/lib/auth';
import { getOrder } from '~/lib/fetchers/order';
import { formatPrice } from '~/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { OrderItems } from '~/components/order-items';
import { PageHeader } from '~/components/page-header';

import { PaymentForm } from '../_components/payment-form';

type PaymentPageProps = {
  params: {
    orderCode: string;
  };
};

export default async function PaymentPage({ params: { orderCode } }: PaymentPageProps) {
  const user = await getUser();
  const order = await getOrder(orderCode);
  const paid = order?.orderStatuses.some(status => status.status === 'PAID');

  if (!user) {
    redirect('/signin');
  }

  if (paid) {
    throw new Error('Order already paid');
  }

  if (!order) {
    notFound();
  }

  return (
    <div className='container pb-8 pt-6 md:py-8'>
      <PageHeader title='Payment' description='Enter your credit card details for payment' />
      <div className='grid gap-8 sm:grid-cols-2'>
        <div>
          <Card>
            <CardHeader className='flex flex-row items-center space-x-4 py-4'>
              <CardTitle className='line-clamp-1 flex-1'>Your Order</CardTitle>
            </CardHeader>
            <Separator className='mb-4' />
            <CardContent className='pb-6 pl-6 pr-0'>
              <OrderItems order={order} />
            </CardContent>
            <Separator className='mb-4' />
            <CardFooter className='space-x-4'>
              <span className='flex-1'>
                Total ({order.orderProducts.reduce((acc, curr) => acc + (curr.quantity ?? 0), 0)})
              </span>
              <span>
                {formatPrice(
                  order.orderProducts.reduce((total, item) => total + (item.quantity ?? 0) * (item.price ?? 0), 0) ?? 0
                )}
              </span>
            </CardFooter>
          </Card>
        </div>
        <PaymentForm orderCode={orderCode} />P
      </div>
    </div>
  );
}
