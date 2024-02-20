import { unstable_cache } from 'next/cache';
import Link from 'next/link';
import { ActiveFilters } from '~/app/(categories)/_components/active-filters';
import { PriceFilter } from '~/app/(categories)/_components/price-filter';
import { isUndefined, omitBy } from 'lodash';

import type { CategoriesFilters, CategoriesSearchParams } from '~/types';
import { getFilteredCategories } from '~/lib/fetchers/category';
import { getFilteredColors } from '~/lib/fetchers/color';
import { getFilteredSizes } from '~/lib/fetchers/size';
import { getSearchParams } from '~/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { Badge } from '~/components/ui/badge';
import { Checkbox } from '~/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';

const getCachedData = unstable_cache(
  async ({
    searchParams,
    brand,
    category,
  }: {
    searchParams: CategoriesSearchParams;
    brand?: string;
    category?: string;
  }) => {
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
      },
      isUndefined
    ) as CategoriesFilters;
    const categoriesPromise = getFilteredCategories(filters);
    const sizesPromise = getFilteredSizes(filters);
    const colorsPromise = getFilteredColors(filters);
    return Promise.all([categoriesPromise, sizesPromise, colorsPromise]);
  },
  [],
  {
    revalidate: 60,
  }
);

type CategoryFiltersProps = {
  searchParams: CategoriesSearchParams;
  brand?: string;
  category?: string;
};

export async function CategoryFilters({ searchParams, brand, category }: CategoryFiltersProps) {
  const [categories, sizes, colors] = await getCachedData({ searchParams, brand, category });

  const selectedSizes = searchParams.sizes?.split(',') ?? [];
  const selectedColors = searchParams.colors?.split(',') ?? [];

  return (
    <>
      <ActiveFilters searchParams={searchParams} />
      <Accordion type='multiple' className='mt-4 rounded-lg border px-5 pb-4'>
        <AccordionItem key='categories' value='categories'>
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent className='flex flex-col space-y-2 p-4 pt-0'>
            <Accordion type='multiple' className='w-full'>
              {categories?.map(category => (
                <AccordionItem key={category.slug} value={category.slug}>
                  <AccordionTrigger>
                    <Link
                      href={
                        brand
                          ? getSearchParams(searchParams, {
                              category: category.slug,
                            })
                          : category.slug + getSearchParams(searchParams, {})
                      }
                      className='hover:text-primary'
                    >
                      {category.title}
                      <Badge variant='outline' className='ml-2 font-normal'>
                        {category.productCount}
                      </Badge>
                    </Link>
                  </AccordionTrigger>
                  <AccordionContent className='flex flex-col space-y-2'>
                    {category.children?.map(child => (
                      <Link
                        key={child.slug}
                        href={
                          brand
                            ? getSearchParams(searchParams, {
                                category: child.slug,
                              })
                            : child.slug + getSearchParams(searchParams, {})
                        }
                        className='hover:text-primary'
                      >
                        {child.title}
                        <Badge variant='outline' className='ml-2 font-normal'>
                          {child.productCount}
                        </Badge>
                      </Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='sizes'>
          <AccordionTrigger>Sizes</AccordionTrigger>
          <AccordionContent className='space-y-2'>
            {sizes.map(size => (
              <div key={size.slug} className='flex items-center space-x-2'>
                <Link
                  href={
                    selectedSizes.includes(size.slug)
                      ? getSearchParams(searchParams, {
                          sizes:
                            selectedSizes.filter(s => s !== size.slug).length > 0
                              ? selectedSizes.filter(s => s !== size.slug).join(',')
                              : undefined,
                          page: undefined,
                        })
                      : getSearchParams(searchParams, {
                          sizes: [...selectedSizes, size.slug].join(','),
                          page: undefined,
                        })
                  }
                  className='flex items-center space-x-2'
                >
                  <Checkbox id={size.slug} checked={selectedSizes.includes(size.slug)} />
                  <label htmlFor={size.slug}>{size.title}</label>
                </Link>
                <Badge variant='outline' className='ml-2 font-normal'>
                  {size.productCount}
                </Badge>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='colors'>
          <AccordionTrigger>Colors</AccordionTrigger>
          <AccordionContent className='grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(6rem,6rem))]'>
            {colors.map(color => (
              <div key={color?.code} className='flex items-center'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={
                        selectedColors.includes(color.slug)
                          ? getSearchParams(searchParams, {
                              colors:
                                selectedColors.filter(s => s !== color.slug).length > 0
                                  ? selectedColors.filter(s => s !== color.slug).join(',')
                                  : undefined,
                              page: undefined,
                            })
                          : getSearchParams(searchParams, {
                              colors: [...selectedColors, color.slug].join(','),
                              page: undefined,
                            })
                      }
                      className='flex items-center space-x-2'
                    >
                      <Checkbox
                        title={color.title ?? ''}
                        key={color.slug}
                        className='size-8 rounded-full border border-border'
                        style={{
                          backgroundColor: `#${color.code}` ?? '',
                        }}
                        checked={selectedColors.includes(color.slug)}
                      ></Checkbox>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div>{color.title}</div>
                  </TooltipContent>
                </Tooltip>
                <Badge variant='outline' className='ml-2 font-normal'>
                  {color.productCount}
                </Badge>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='price'>
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent className='flex items-center space-x-2 px-1 pt-1'>
            <PriceFilter searchParams={searchParams} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
