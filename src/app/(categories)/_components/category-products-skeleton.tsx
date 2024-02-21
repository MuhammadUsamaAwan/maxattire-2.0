import { Skeleton } from '~/components/ui/skeleton';
import { ProductCardSkeleton } from '~/components/product-card-skeleton';

export function CategoryProductsSkeleton() {
  return (
    <>
      <div className='mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center'>
        <Skeleton className='h-6 w-1/4' />
        <Skeleton className='h-9 w-1/3' />
      </div>
      <div className='grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-2 xl:grid-cols-3'>
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
      </div>
      <div className='mt-4 flex justify-end space-x-2'>
        <Skeleton className='h-9 w-20' />
        <Skeleton className='h-9 w-20' />
      </div>
    </>
  );
}
