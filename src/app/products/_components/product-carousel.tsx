import { getProductStockImages } from '~/lib/fetchers/product-stock-image';

import { ProductImageCarousel } from './product-image-carousel';

type ProductCarouselProps = {
  productSlug: string;
  colorSlug?: string;
};

export async function ProductCarousel({ productSlug, colorSlug }: ProductCarouselProps) {
  const stockImages = await getProductStockImages(productSlug, colorSlug);
  const images = stockImages.map(image => ({ src: image.fileName ?? '', alt: `${productSlug} - ${colorSlug ?? ''}` }));

  return <ProductImageCarousel className='w-full md:w-1/2' images={images} />;
}
