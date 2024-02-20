import Image from 'next/image';
import Link from 'next/link';

import { getBrands } from '~/lib/fetchers/brand';
import { ContentSection } from '~/components/content-section';

export async function Brands() {
  const brands = await getBrands();

  return (
    <ContentSection title='Our Premium Brands' description='Explore our premium brands from around the world'>
      <div className='grid grid-cols-2 border-[0.5px] sm:grid-cols-4'>
        {brands.map(brand => (
          <Link key={brand.slug} href={`/brands/${brand.slug}`} className='flex justify-center border-[0.5px] p-6'>
            <Image
              src={brand.logo ?? ''}
              alt={brand.slug}
              width={155}
              height={70}
              sizes='(min-width: 920px) 155px, (min-width: 700px) calc(22.5vw - 48px), (min-width: 640px) calc(5vw + 71px), (min-width: 460px) 155px, calc(50vw - 65px)'
            />
          </Link>
        ))}
      </div>
    </ContentSection>
  );
}
