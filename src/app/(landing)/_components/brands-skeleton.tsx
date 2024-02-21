import { Skeleton } from '~/components/ui/skeleton';
import { ContentSection } from '~/components/content-section';

export function BrandsSkeleton() {
  return (
    <ContentSection title='Our Premium Brands' description='Explore our premium brands from around the world'>
      <div className='grid grid-cols-2 border-[0.5px] sm:grid-cols-4'>
        {Array(12)
          .fill(null)
          .map((_, i) => (
            <div key={i} className='flex justify-center border-[0.5px] p-6'>
              <Skeleton className='h-[70px] w-[155px]' />
            </div>
          ))}
      </div>
    </ContentSection>
  );
}
