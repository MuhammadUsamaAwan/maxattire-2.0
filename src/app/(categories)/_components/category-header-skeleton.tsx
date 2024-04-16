import { Skeleton } from '~/components/ui/skeleton';

export function CategoryHeaderSkeleton() {
  return (
    <div className='mb-6 space-y-1'>
      <Skeleton className='mx-auto h-10 w-1/2 sm:w-1/3' />
      <Skeleton className='mx-auto h-6 sm:w-1/2' />
      <Skeleton className='mx-auto h-6 sm:w-1/2' />
    </div>
  );
}
