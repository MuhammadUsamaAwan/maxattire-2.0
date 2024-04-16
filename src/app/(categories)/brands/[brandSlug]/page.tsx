import { Suspense } from 'react';
import { type Metadata } from 'next';

import type { CategoriesSearchParams } from '~/types';
import { unslugify } from '~/lib/utils';

import { BrandHeader } from '../../_components/brand-header';
import { CategoryFilters } from '../../_components/category-filters';
import { CategoryFiltersSkeleton } from '../../_components/category-filters-skeleton';
import { CategoryHeaderSkeleton } from '../../_components/category-header-skeleton';
import { CategoryProducts } from '../../_components/category-products';
import { CategoryProductsSkeleton } from '../../_components/category-products-skeleton';

export type BrandPageProps = {
  params: {
    brandSlug: string;
  };
  searchParams: CategoriesSearchParams;
};

export function generateMetadata({ params: { brandSlug } }: BrandPageProps): Metadata {
  return {
    title: `${unslugify(brandSlug)}'s Collection`,
    description: `Browse ${unslugify(brandSlug)}'s collection`,
  };
}

export default function BrandPage({ searchParams, params: { brandSlug } }: BrandPageProps) {
  return (
    <div className='container pb-8 pt-6 md:py-8'>
      <Suspense fallback={<CategoryHeaderSkeleton />}>
        <BrandHeader slug={brandSlug} />
      </Suspense>
      <div className='mb-8 space-y-1'>
        <div className='flex flex-col gap-6 lg:flex-row lg:gap-10'>
          <div className='w-full lg:w-80'>
            <Suspense fallback={<CategoryFiltersSkeleton />}>
              <CategoryFilters brand={brandSlug} searchParams={searchParams} />
            </Suspense>
          </div>
          <div className='flex-1 sm:mt-1.5'>
            <Suspense fallback={<CategoryProductsSkeleton />}>
              <CategoryProducts brand={brandSlug} searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
