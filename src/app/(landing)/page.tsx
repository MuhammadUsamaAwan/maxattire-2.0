import { Suspense } from 'react';

import { ProductCarouselSectionSkeleton } from '~/components/product-carousel-section-skeleton';

import { About } from './_components/about';
import { Brands } from './_components/brands';
import { FeaturedProducts } from './_components/featured-products';
import { Features } from './_components/features';
import { GridSection } from './_components/grid-section';
import { Hero } from './_components/hero';
import { NewProducts } from './_components/new-products';
import { Solutions } from './_components/solutions';
import { TopProducts } from './_components/top-products';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <About />
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
      <Solutions />
      <Suspense
        fallback={
          <ProductCarouselSectionSkeleton
            title='New Arrivals'
            description='Explore our latest products'
            className='bg-accent'
          />
        }
      >
        <NewProducts />
      </Suspense>
      <Suspense fallback={<ProductCarouselSectionSkeleton title='Top Products' description='Most popular products' />}>
        <TopProducts />
      </Suspense>
      <GridSection />
    </>
  );
}
