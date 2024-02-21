import { AspectRatio } from '~/components/ui/aspect-ratio';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { PlaceholderImage } from '~/components/placeholder-image';

export function ProductCardSkeleton() {
  return (
    <Card>
      <CardHeader className='border-b p-0'>
        <div>
          <AspectRatio ratio={4 / 3}>
            <PlaceholderImage className='rounded-none' asChild isSkeleton />
          </AspectRatio>
        </div>
      </CardHeader>
      <CardContent className='space-y-1.5 p-4'>
        <CardTitle className='line-clamp-1'>
          <Skeleton className='h-4 w-full' />
        </CardTitle>
        <Skeleton className='h-6 w-1/4' />
        <Skeleton className='size-6 w-1/2' />
        <div className='flex items-center justify-between'>
          <Skeleton className='size-6 w-1/3' />
          <Skeleton className='size-6 w-1/3' />
        </div>
      </CardContent>
    </Card>
  );
}
