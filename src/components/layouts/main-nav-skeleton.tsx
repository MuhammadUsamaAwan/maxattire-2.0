import { Skeleton } from '~/components/ui/skeleton';

export function MainNavSkeleton() {
  return (
    <div className='flex space-x-4'>
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className='h-9 w-20' />
        ))}
    </div>
  );
}
