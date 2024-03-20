import { Suspense } from 'react';
import { type Metadata } from 'next';

import type { CategoriesSearchParams } from '~/types';

import { CategoryFiltersSkeleton } from '../_components/category-filters-skeleton';
import { CategoryProducts } from '../_components/category-products';
import { CategoryProductsSkeleton } from '../_components/category-products-skeleton';
import { CategoryFilters } from '..//_components/category-filters';

export type SearchPageProps = {
  searchParams: CategoriesSearchParams;
};

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  return {
    title: `Search Results for ${searchParams.q}`,
    description: `Search results for ${searchParams.q}`,
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className='container pb-8 pt-6 md:py-8'>
      <div className='mb-6 space-y-1'>
        <h1 className='text-center text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]'>
          Search Results for {searchParams.q}
        </h1>
        <p className='text-center text-base text-muted-foreground sm:text-lg'>
          Highest quality collections with free & fast shipping
        </p>
      </div>
      <div className='mb-8 space-y-1'>
        <div className='flex flex-col gap-6 lg:flex-row lg:gap-10'>
          <div className='w-full lg:w-80'>
            <Suspense fallback={<CategoryFiltersSkeleton />}>
              <CategoryFilters searchParams={searchParams} />
            </Suspense>
          </div>
          <div className='flex-1 sm:mt-1.5'>
            <Suspense fallback={<CategoryProductsSkeleton />}>
              <CategoryProducts searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
