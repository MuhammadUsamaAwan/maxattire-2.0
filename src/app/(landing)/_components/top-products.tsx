import { getTopProducts } from '~/lib/fetchers/product';
import { ProductCarouselSection } from '~/components/product-carousel-section';

export async function TopProducts() {
  const topProducts = await getTopProducts();

  return (
    <ProductCarouselSection
      products={topProducts}
      title='Top Products'
      description='Most popular products'
      className='bg-accent'
    />
  );
}
