import { Suspense } from 'react';

import { ProductCarouselSectionSkeleton } from '~/components/product-carousel-section-skeleton';

import { Brands } from './_components/brands';
import { FeaturedProducts } from './_components/featured-products';
import { Hero } from './_components/hero';
import { NewProducts } from './_components/new-products';
import { TopProducts } from './_components/top-products';
import { WholesaleProducts } from './_components/wholesale-products';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Brands />
      <Suspense
        fallback={
          <ProductCarouselSectionSkeleton
            title='Featured Products'
            description='Our featured products'
            className='bg-accent'
          />
        }
      >
        <FeaturedProducts />
      </Suspense>
      <Suspense
        fallback={<ProductCarouselSectionSkeleton title='New Arrivals' description='Explore our latest products' />}
      >
        <NewProducts />
      </Suspense>
      <Suspense
        fallback={
          <ProductCarouselSectionSkeleton
            title='Top Products'
            description='Most popular products'
            className='bg-accent'
          />
        }
      >
        <TopProducts />
      </Suspense>
      <Suspense
        fallback={<ProductCarouselSectionSkeleton title='Wholesale Products' description='Our wholesale products' />}
      >
        <WholesaleProducts />
      </Suspense>
    </>
  );
}
