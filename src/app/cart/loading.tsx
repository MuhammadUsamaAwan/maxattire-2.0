import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Skeleton } from '~/components/ui/skeleton';
import { PageHeader } from '~/components/page-header';

export default function CartPageLoading() {
  return (
    <div className='container grid items-center gap-8 pb-8 pt-6 md:py-8'>
      <PageHeader title='Checkout' description='Checkout with your cart items' className='mb-0' />
      <Card>
        <CardHeader className='flex flex-row items-center space-x-4 py-4'>
          <CardTitle className='line-clamp-1 flex-1'>Your Cart</CardTitle>
          <Skeleton className='h-8 w-1/6' />
        </CardHeader>
        <Separator className='mb-4' />
        <CardContent className='space-y-4 px-6 py-2'>
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
        </CardContent>
        <Separator className='mb-4' />
        <CardFooter className='justify-between space-x-4'>
          <Skeleton className='h-6 w-1/5' />
          <Skeleton className='h-6 w-1/5' />
        </CardFooter>
      </Card>
    </div>
  );
}
