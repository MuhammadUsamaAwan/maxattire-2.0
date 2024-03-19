import Link from 'next/link';
import { SortProducts } from '~/app/(categories)/_components/sort-products';
import { isUndefined, omitBy } from 'lodash';

import type { CategoriesFilters, CategoriesSearchParams } from '~/types';
import { getFilteredProducts } from '~/lib/fetchers/product';
import { getSearchParams } from '~/lib/utils';
import { Button, buttonVariants } from '~/components/ui/button';
import { Icons } from '~/components/icons';
import { ProductCard } from '~/components/product-card';

async function getData({
  searchParams,
  brand,
  category,
}: {
  searchParams: CategoriesSearchParams;
  brand?: string;
  category?: string;
}) {
  const filters = omitBy(
    {
      brand,
      colors: searchParams.colors?.split(','),
      sizes: searchParams.sizes?.split(','),
      category: category ?? searchParams.category,
      minPrice: searchParams.min_price ? Number(searchParams.min_price) : undefined,
      maxPrice: searchParams.max_price ? Number(searchParams.max_price) : undefined,
      sort: searchParams.sort,
      page: searchParams.page ? Number(searchParams.page) : undefined,
      q: searchParams.q,
    },
    isUndefined
  ) as CategoriesFilters;
  return getFilteredProducts(filters);
}

type CategoryProductsProps = {
  searchParams: CategoriesSearchParams;
  brand?: string;
  category?: string;
};

export async function CategoryProducts({ brand, searchParams, category }: CategoryProductsProps) {
  const { products, productsCount } = await getData({ searchParams, brand, category });
  const { page } = searchParams;
  const currentPage = Number(page ?? 1);

  return (
    <>
      <div className='mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center'>
        <div>
          Showing <span className='font-semibold'>{(currentPage - 1) * 12 + productsCount === 0 ? 0 : 1}</span> to{' '}
          <span className='font-semibold'>{Math.min(currentPage * 12, productsCount ?? 0)}</span> of{' '}
          <span className='font-semibold'>{productsCount ?? 0}</span>
        </div>
        <div className='flex items-center space-x-3'>
          <div className='flex items-center space-x-1'>
            <Icons.caretSort className='size-4' />
            <span>Sort:</span>
          </div>
          <SortProducts searchParams={searchParams} />
        </div>
      </div>
      <div className='grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-2 xl:grid-cols-3'>
        {products.map(product => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      {productsCount === 0 && <div className='text-center'>No Products Found</div>}
      <div className='mt-4 flex justify-end space-x-2'>
        {currentPage > 1 ? (
          <Link
            className={buttonVariants()}
            href={getSearchParams(searchParams, {
              page: String(currentPage - 1),
            })}
          >
            <Icons.chevronLeft className='mr-2 size-4' /> Previous
          </Link>
        ) : (
          <Button disabled>
            <Icons.chevronLeft className='mr-2 size-4' /> Previous
          </Button>
        )}
        {Math.ceil((productsCount ?? 0) / 12) > currentPage ? (
          <Link
            className={buttonVariants()}
            href={getSearchParams(searchParams, {
              page: String(currentPage + 1),
            })}
          >
            Next <Icons.chevronRight className='ml-2 size-4' />
          </Link>
        ) : (
          <Button disabled>
            Next <Icons.chevronRight className='ml-2 size-4' />
          </Button>
        )}
      </div>
    </>
  );
}
