import { getNewProducts } from '~/lib/fetchers/product';
import { ProductCarouselSection } from '~/components/product-carousel-section';

export async function NewProducts() {
  const newProducts = await getNewProducts();

  return (
    <ProductCarouselSection products={newProducts} title='New Arrivals' description='Explore our latest products' />
  );
}
