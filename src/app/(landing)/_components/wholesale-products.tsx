import { getWholeSaleProducts } from '~/lib/fetchers/product';
import { ProductCarouselSection } from '~/components/product-carousel-section';

export async function WholesaleProducts() {
  const wholesaleProducts = await getWholeSaleProducts();

  return (
    <ProductCarouselSection
      products={wholesaleProducts}
      title='Wholesale Products'
      description='Our wholesale products'
    />
  );
}
