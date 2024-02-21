import { getFeaturedProducts } from '~/lib/fetchers/product';
import { ProductCarouselSection } from '~/components/product-carousel-section';

export async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <ProductCarouselSection
      products={featuredProducts}
      title='Featured Products'
      description='Our featured products'
      className='bg-accent'
    />
  );
}
