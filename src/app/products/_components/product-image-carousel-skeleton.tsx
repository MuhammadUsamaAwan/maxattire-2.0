import { Icons } from '~/components/icons';

export function ProductImageCarouselSkeleton() {
  return (
    <div
      aria-label='Product Placeholder'
      role='img'
      aria-roledescription='placeholder'
      className='flex aspect-square size-full flex-1 animate-pulse items-center justify-center bg-secondary'
    >
      <Icons.placeholder className='size-9 text-muted-foreground' aria-hidden='true' />
    </div>
  );
}
