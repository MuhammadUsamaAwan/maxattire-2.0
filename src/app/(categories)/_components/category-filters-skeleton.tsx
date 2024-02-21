import { Skeleton } from '~/components/ui/skeleton';

export function CategoryFiltersSkeleton() {
  return (
    <div className='space-y-4 rounded-lg border px-5 py-4'>
      <Skeleton className='h-10 w-full' />
      <Skeleton className='h-10 w-full' />
      <Skeleton className='h-10 w-full' />
      <Skeleton className='h-10 w-full' />
    </div>
  );
}
