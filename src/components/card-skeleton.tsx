import { AspectRatio } from '~/components/ui/aspect-ratio';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { PlaceholderImage } from '~/components/placeholder-image';

export function CardSkeleton() {
  return (
    <Card>
      <CardHeader className='border-b p-0'>
        <AspectRatio ratio={4 / 3}>
          <PlaceholderImage className='rounded-none' asChild isSkeleton />
        </AspectRatio>
      </CardHeader>
      <CardContent className='space-y-1.5 p-4'>
        <CardTitle>
          <Skeleton className='h-4 w-full' />
        </CardTitle>
        <Skeleton className='h-6 w-1/2' />
      </CardContent>
    </Card>
  );
}
