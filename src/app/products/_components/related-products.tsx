import { getRelatedProducts } from '~/lib/fetchers/product';
import { ProductCarouselSection } from '~/components/product-carousel-section';

type RelatedProductsProps = {
  slug: string;
};

export async function RelatedProducts({ slug }: RelatedProductsProps) {
  const relatedProducts = await getRelatedProducts(slug);

  return (
    <ProductCarouselSection
      products={relatedProducts}
      title='Related Products'
      description='Other products you might like'
      className='pb-0 pt-6 md:pt-10'
    />
  );
}
