import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Skeleton } from '~/components/ui/skeleton';
import { PageHeader } from '~/components/page-header';

export default function PaymentPageLoading() {
  return (
    <div className='container pb-8 pt-6 md:py-8'>
      <PageHeader title='Payment' description='Enter your credit card details for payment' />
      <div className='grid gap-8 sm:grid-cols-2'>
        <div>
          <Card>
            <CardHeader className='flex flex-row items-center space-x-4 py-4'>
              <CardTitle className='line-clamp-1 flex-1'>Your Order</CardTitle>
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
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className='h-4 w-1/3' />
            </CardTitle>
            <CardDescription>
              <Skeleton className='h-5 w-1/2' />
            </CardDescription>
            <CardContent className='space-y-3 px-0'>
              {Array(3)
                .fill(null)
                .map((_, i) => (
                  <div className='space-y-2' key={i}>
                    <Skeleton className='h-4 w-1/3' />
                    <Skeleton className='h-8 w-full' />
                  </div>
                ))}
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
