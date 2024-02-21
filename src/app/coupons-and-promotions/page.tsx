import { Suspense } from 'react';
import { type Metadata } from 'next';

import { CardSkeleton } from '~/components/card-skeleton';
import { PageHeader } from '~/components/page-header';

import Coupons from './_components/coupons';

export const metadata: Metadata = {
  title: 'Coupons & Promotions',
  description: 'Get the best deals on your favorite products',
};

export default function CouponsPromotionsPage() {
  return (
    <div className='container py-10'>
      <PageHeader title='Discount Coupons' description='Get the best deals on your favorite products' />
      <Suspense
        fallback={
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <CardSkeleton key={i} />
              ))}
          </div>
        }
      >
        <Coupons />
      </Suspense>
    </div>
  );
}
