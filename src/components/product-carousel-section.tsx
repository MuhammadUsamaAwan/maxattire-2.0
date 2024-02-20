import type { Products } from '~/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel';
import { ContentSection } from '~/components/content-section';
import { ProductCard } from '~/components/product-card';

type ProductCarouselSectionProps = React.HTMLAttributes<HTMLDivElement> & {
  products: Products;
  title: string;
  description: string;
};

export function ProductCarouselSection({ products, ...props }: ProductCarouselSectionProps) {
  return (
    <ContentSection {...props}>
      <Carousel>
        <CarouselContent>
          {products.map(product => (
            <CarouselItem key={product.slug} className='sm:basis-1/3'>
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='left-4' />
        <CarouselNext className='right-4' />
      </Carousel>
    </ContentSection>
  );
}
