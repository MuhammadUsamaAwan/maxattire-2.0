import Image from 'next/image';
import Link from 'next/link';

import { type Order } from '~/types';
import { cn, formatPrice } from '~/lib/utils';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Separator } from '~/components/ui/separator';
import { Icons } from '~/components/icons';

type Props = {
  order: Order;
  reviewOrder?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export function OrderItems({ order, reviewOrder, className, ...props }: Props) {
  return (
    <ScrollArea className='h-full'>
      <div className={cn('flex w-full flex-col gap-5 pr-6', className)} {...props}>
        {order?.orderProducts.map(item => (
          <div key={item.id} className='space-y-3'>
            <div className={'flex items-start justify-between gap-4'}>
              <div className='flex items-center space-x-4'>
                <div className='relative aspect-square size-16 min-w-fit overflow-hidden rounded'>
                  {item.product?.thumbnail ? (
                    <Image
                      src={item.product?.thumbnail}
                      alt={item?.product?.title ?? ''}
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      fill
                      className='absolute object-cover'
                      loading='lazy'
                    />
                  ) : (
                    <div className='flex h-full items-center justify-center bg-secondary'>
                      <Icons.placeholder className='size-4 text-muted-foreground' aria-hidden='true' />
                    </div>
                  )}
                </div>
                <div className='flex flex-col space-y-1 self-start'>
                  <Link
                    href={`/products/${item.product?.slug}`}
                    className='line-clamp-1 text-sm font-medium underline-offset-4 hover:underline'
                  >
                    {item.product?.title}
                  </Link>
                  <span className='line-clamp-1 text-xs text-muted-foreground'>
                    {item.productStock.color?.title} - {item.productStock.size?.title}
                  </span>
                  {reviewOrder && (
                    <Link
                      href={`/dashboard/orders/${order.code}/${item.id}/${item.product?.id}`}
                      className='line-clamp-1 text-[12px] font-medium text-primary underline-offset-4 hover:underline'
                    >
                      Write a review
                    </Link>
                  )}
                </div>
              </div>
              <div className='flex flex-col space-y-1 font-medium'>
                <span className='ml-auto line-clamp-1 text-sm'>
                  {formatPrice(((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2))}
                </span>
                <span className='line-clamp-1 text-xs text-muted-foreground'>{formatPrice(item.price ?? 0)} each</span>
              </div>
            </div>
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
