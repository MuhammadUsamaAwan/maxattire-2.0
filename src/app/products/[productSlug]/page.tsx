import { Suspense } from 'react';
import { type Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';

import { env } from '~/env';
import { getUser } from '~/lib/auth';
import { getProductColors } from '~/lib/fetchers/color';
import { getProduct, getProductSeo } from '~/lib/fetchers/product';
import { getProductStocks } from '~/lib/fetchers/product-stock';
import { absoluteUrl, formatPrice } from '~/lib/utils';
import { Separator } from '~/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { ProductCarouselSectionSkeleton } from '~/components/product-carousel-section-skeleton';
import { Rating } from '~/components/rating';
import { TableSkeleton } from '~/components/table-skeleton';

import { AddToCart } from '../_components/add-to-cart';
import { ProductCarousel } from '../_components/product-carousel';
import { ProductImageCarouselSkeleton } from '../_components/product-image-carousel-skeleton';
import { ProductReviews } from '../_components/product-reviews';
import { RelatedProducts } from '../_components/related-products';
import { SizeChart } from '../_components/size-chart';

const getCachedData = unstable_cache(
  async (slug: string) => {
    const productPromise = getProduct(slug);
    const colorsPromise = getProductColors(slug);
    return Promise.all([productPromise, colorsPromise]);
  },
  [],
  {
    revalidate: 60,
  }
);

const getCachedStockData = unstable_cache(
  async (productSlug: string, colorSlug?: string) => {
    const stockPromise = getProductStocks(productSlug, colorSlug);
    return Promise.all([stockPromise]);
  },
  [],
  {
    revalidate: 60,
  }
);

type ProductPageProps = {
  params: {
    productSlug: string;
  };
  searchParams: {
    color: string | undefined;
  };
};

export async function generateMetadata({ params: { productSlug } }: ProductPageProps): Promise<Metadata> {
  const product = await getProductSeo(productSlug);

  if (!product) {
    return {};
  }

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: product.metaTitle,
    description: product.metaDescription,
    keywords: product.metaTag,
    openGraph: {
      title: product.metaTitle ?? '',
      description: product.metaDescription ?? '',
      type: 'article',
      url: absoluteUrl(productSlug),
      images: [
        {
          url: product.metaImg ?? '',
          width: 1200,
          height: 630,
          alt: product.metaTitle ?? '',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.metaTitle ?? '',
      description: product.metaDescription ?? '',
      images: product.metaImg ? [product.metaImg] : [],
    },
  };
}

export default async function ProductPage({ params: { productSlug }, searchParams: { color } }: ProductPageProps) {
  const [product, colors] = await getCachedData(productSlug);
  const user = await getUser();
  const [stock] = await getCachedStockData(productSlug, color);

  const rating = !product
    ? 0
    : product.reviews.length === 0
      ? 0
      : product.reviews.reduce((acc, review) => acc + (review.rating ?? 0), 0) / product.reviews.length;

  if (!product) {
    notFound();
  }

  return (
    <div className='container space-y-8 pb-8 pt-6 md:py-8'>
      <div className='flex flex-col gap-8 md:flex-row md:gap-16'>
        <Suspense fallback={<ProductImageCarouselSkeleton />}>
          <ProductCarousel productSlug={productSlug} colorSlug={color} />
        </Suspense>
        <Separator className='mt-4 md:hidden' />
        <div className='flex w-full flex-col gap-4 md:w-1/2'>
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
          <Separator className='my-1.5' />
          <AddToCart productId={product.id} colors={colors} stock={stock} color={color} isAuthed={Boolean(user)} />
          <Separator className='mt-5' />
          <Tabs defaultValue='description'>
            <TabsList>
              <TabsTrigger value='description'>Description</TabsTrigger>
              <TabsTrigger value='sizeChart'>Size Chart</TabsTrigger>
            </TabsList>
            <TabsContent value='description'>
              <div
                className='prose max-w-full dark:prose-invert'
                dangerouslySetInnerHTML={{
                  __html: product?.description ?? 'No description is available for this product.',
                }}
              />
            </TabsContent>
            <TabsContent value='sizeChart'>
              <Suspense fallback={<TableSkeleton header={4} items={4} />}>
                <SizeChart slug={productSlug} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Suspense
        fallback={
          <ProductCarouselSectionSkeleton
            title='Related Products'
            description='Other products you might like'
            className='pb-0 pt-6 md:pt-10'
          />
        }
      >
        <RelatedProducts slug={productSlug} />
      </Suspense>
      <div className='pt-6 md:pt-10'>
        <h2 className='text-2xl font-bold'>Product Reviews</h2>
        <div className='space-y-4 pt-4'>
          <Suspense fallback={<div>Loading Reviews....</div>}>
            <ProductReviews slug={productSlug} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
