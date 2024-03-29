import Image from 'next/image';
import Link from 'next/link';

import { getCoupons } from '~/lib/fetchers/coupon';
import { getFileUrl } from '~/lib/utils';
import { AspectRatio } from '~/components/ui/aspect-ratio';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { CopyButton } from '~/components/copy-button';
import { PlaceholderImage } from '~/components/placeholder-image';

export default async function Coupons() {
  const coupons = await getCoupons();

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {coupons?.map(coupon => (
        <Card className='overflow-hidden' key={coupon.id}>
          <CardHeader className='border-b p-0'>
            <Link href={`/categories/${coupon.category.slug}`}>
              <AspectRatio ratio={4 / 3}>
                {coupon.file ? (
                  <Image
                    src={getFileUrl(coupon.file)}
                    alt='coupon'
                    className='object-cover'
                    fill
                    sizes='(min-width: 1500px) 443px, (min-width: 1040px) calc(27.27vw + 39px), (min-width: 780px) calc(50vw - 34px), 93.04vw'
                  />
                ) : (
                  <PlaceholderImage className='rounded-none' asChild />
                )}
              </AspectRatio>
            </Link>
          </CardHeader>
          <CardContent className='space-y-1.5 p-4'>
            <CardTitle className='line-clamp-1 flex items-center justify-between'>
              <Link href={`/categories/${coupon.category.slug}`} className='text-xl'>
                {coupon.code}
              </Link>
              <CopyButton value={coupon.code} size='sm' variant='outline' />
            </CardTitle>
            <p>
              {coupon.discountType === 'percentage' ? `${coupon.discount}% off` : `$${coupon.discount} off`} on{' '}
              {coupon.category.title}&apos;s collection
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
