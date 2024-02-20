import { getFeaturedProducts, getNewProducts, getTopProducts, getWholeSaleProducts } from '~/lib/fetchers/product';
import { ProductCarouselSection } from '~/components/product-carousel-section';

import { Brands } from './_components/brands';
import { Hero } from './_components/hero';

export default async function HomePage() {
  const newProductsPromise = getNewProducts();
  const topProductsPromise = getTopProducts();
  const featuredProductsPromise = getFeaturedProducts();
  const wholeSaleProductsPromise = getWholeSaleProducts();

  const [newProducts, topProducts, featuredProducts, wholeSaleProducts] = await Promise.all([
    newProductsPromise,
    topProductsPromise,
    featuredProductsPromise,
    wholeSaleProductsPromise,
  ]);

  return (
    <>
      <Hero />
      <Brands />
      <ProductCarouselSection
        products={featuredProducts}
        title='Featured Products'
        description='Our featured products'
        className='bg-accent'
      />
      <ProductCarouselSection products={newProducts} title='New Arrivals' description='Explore our latest products' />
      <ProductCarouselSection
        products={topProducts}
        title='Top Products'
        description='Most popular products'
        className='bg-accent'
      />
      <ProductCarouselSection
        products={wholeSaleProducts}
        title='Wholesale Products'
        description='Our wholesale products'
      />
    </>
  );
}
