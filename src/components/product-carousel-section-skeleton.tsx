import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel';
import { ContentSection } from '~/components/content-section';
import { ProductCardSkeleton } from '~/components/product-card-skeleton';

type ProductCarouselSectionSkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description: string;
};

export function ProductCarouselSectionSkeleton({ ...props }: ProductCarouselSectionSkeletonProps) {
  return (
    <ContentSection {...props}>
      <Carousel>
        <CarouselContent>
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <CarouselItem key={i} className='sm:basis-1/3'>
                <ProductCardSkeleton />
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className='left-4' />
        <CarouselNext className='right-4' />
      </Carousel>
    </ContentSection>
  );
}
