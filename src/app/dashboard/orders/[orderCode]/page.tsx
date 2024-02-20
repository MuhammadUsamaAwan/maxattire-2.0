import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { getUser } from '~/lib/auth';
import { getOrder } from '~/lib/fetchers/order';
import { formatPrice } from '~/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { OrderItems } from '~/components/order-items';

import { OrderStatusBadge } from '../_components/order-status-badge';

type OrderDetailPageProps = {
  params: {
    orderCode: string;
  };
};

export default async function OrderDetailPage({ params: { orderCode } }: OrderDetailPageProps) {
  const user = await getUser();
  const order = await getOrder(orderCode);

  if (!user) {
    redirect('/signin');
  }

  if (!order) {
    notFound();
  }

  return (
    <div className='grid items-center gap-8 pb-8 pt-6 md:py-8'>
      <div className='grid gap-1'>
        <h1 className='text-2xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]'>
          Order Details
        </h1>
        <p className='text-sm text-muted-foreground sm:text-base'>Details for your order</p>
        <Separator className='mt-2.5' />
      </div>
      <Card>
        <CardHeader className='flex flex-row items-center space-x-4 py-4'>
          <CardTitle className='line-clamp-1 flex-1'>
            <div className='flex items-center justify-between'>
              <h2>Order# {orderCode}</h2>
              {order?.orderStatuses[0]?.status === 'AWAITING_PAYMENT' ? (
                <Link href={`/payment/${order.id}`}>
                  <OrderStatusBadge status={order.orderStatuses[order.orderStatuses.length - 1]?.status} />
                </Link>
              ) : (
                <OrderStatusBadge status={order.orderStatuses[order.orderStatuses.length - 1]?.status} />
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <Separator className='mb-4' />
        <CardContent className='pb-6 pl-6 pr-0'>
          <OrderItems
            order={order}
            reviewOrder={order.orderStatuses[order.orderStatuses.length - 1]?.status !== 'AWAITING_PAYMENT'}
          />
        </CardContent>
        <Separator className='mb-4' />
        <CardFooter className='space-x-4'>
          <span className='flex-1'>
            Total ({order.orderProducts.reduce((acc, item) => acc + (item.quantity ?? 0), 0)})
          </span>
          <span>
            {formatPrice(
              order.orderProducts.reduce((total, item) => total + (item.quantity ?? 0) * (item.price ?? 0), 0) ?? 0
            )}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
