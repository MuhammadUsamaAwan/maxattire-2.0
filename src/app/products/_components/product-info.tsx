import { notFound } from 'next/navigation';

import { getProduct } from '~/lib/fetchers/product';
import { formatPrice } from '~/lib/utils';
import { Rating } from '~/components/rating';

type ProductInfoProps = {
  slug: string;
};

export default async function ProductInfo({ slug }: ProductInfoProps) {
  const product = await getProduct(slug);

  const rating = !product
    ? 0
    : product.reviews.length === 0
      ? 0
      : product.reviews.reduce((acc, review) => acc + (review.rating ?? 0), 0) / product.reviews.length;

  if (!product) {
    notFound();
  }

  return (
    <div className='space-y-2'>
      <h2 className='line-clamp-1 text-2xl font-bold'>{product?.title}</h2>
      <div>
        <span className='font-medium'>SKU:</span> {product?.sku}
      </div>
      <div className='flex items-center space-x-2'>
        <Rating rating={rating} />
        <span>({product.reviews.length})</span>
      </div>
      <div className='text-xl font-semibold text-primary'>
        {product?.discount && product.discount > 0 ? (
          <div className='space-x-2'>
            <span className='line-through'>{formatPrice(product.sellPrice ?? 0)}</span>
            <span>{formatPrice((product.sellPrice ?? 0) - product.discount)}</span>
          </div>
        ) : (
          formatPrice(product?.sellPrice ?? 0)
        )}
      </div>
    </div>
  );
}
