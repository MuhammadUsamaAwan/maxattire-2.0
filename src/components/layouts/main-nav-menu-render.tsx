'use client';

import Image from 'next/image';
import Link from 'next/link';

import type { Brands, Categories } from '~/types';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '~/components/ui/navigation-menu';

type MainNavMenuRenderProps = {
  categories: Categories;
  brands: Brands;
};

export function MainNavMenuRender({ categories, brands }: MainNavMenuRenderProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {categories.map(category => (
          <NavigationMenuItem key={category.slug}>
            <NavigationMenuTrigger className='h-auto capitalize'>
              <Link href={`/categories/${category.slug}`}>{category.title}</Link>
            </NavigationMenuTrigger>
            <NavigationMenuContent className='flex items-start gap-3 p-6'>
              <ul className='w-max shrink-0 space-y-1.5 md:w-[200px]'>
                <li className='text-sm font-semibold'>Categories Pages</li>
                {category.children.map(subCategory => (
                  <li key={subCategory.slug}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/categories/${subCategory.slug}`}
                        className='text-sm hover:text-primary focus:text-primary'
                      >
                        {subCategory.title}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
              <div className='space-y-1.5'>
                <div className='text-sm font-semibold'>Featured Brands</div>
                <div className='grid grid-cols-4 border-[0.5px] md:w-[400px] lg:w-[500px]'>
                  {brands.map(brand => (
                    <Link key={brand.slug} href={`/brands/${brand.slug}`} className='block border-[0.5px] p-5'>
                      <Image src={brand.logo ?? ''} alt={brand.slug} width={86} height={38} sizes='86px' />
                    </Link>
                  ))}
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
