import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { getUser } from '~/lib/auth';
import { getProductSlugTitle } from '~/lib/fetchers/product';
import { getOrderProductReview } from '~/lib/fetchers/review';
import { Separator } from '~/components/ui/separator';
import { ProductReview } from '~/components/product-review';

import { AddReviewForm } from '../../../_components/add-review-form';

type ReviewProductPageProps = {
  params: {
    orderProductId: string;
    productId: string;
  };
};

export default async function ReviewProductPage({ params: { orderProductId, productId } }: ReviewProductPageProps) {
  const user = await getUser();
  const review = await getOrderProductReview(Number(orderProductId), Number(productId));
  const product = await getProductSlugTitle(Number(productId));

  if (!user) {
    redirect('/signin');
  }

  if (!product) {
    notFound();
  }

  return (
    <div className='grid items-center gap-8 pb-8 pt-6 md:py-8'>
      <div className='grid gap-1'>
        <h1 className='text-2xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]'>
          Product review
        </h1>
        <p className='max-w-[750px] text-sm text-muted-foreground sm:text-base'>
          Review{' '}
          <Link href={`/products/${product.slug}`} className='underline-offset-4 hover:underline'>
            {product.title}
          </Link>
        </p>
        <Separator className='mt-2.5' />
      </div>
      {review ? (
        <ProductReview review={review} />
      ) : (
        <AddReviewForm productId={Number(productId)} orderProductId={Number(orderProductId)} />
      )}
    </div>
  );
}
