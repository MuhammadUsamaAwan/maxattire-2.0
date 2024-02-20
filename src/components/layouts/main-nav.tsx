'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { siteConfig } from '~/config/site';
import type { Brands, Categories } from '~/types';
import { cn } from '~/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '~/components/ui/navigation-menu';

type MainNavProps = {
  categories: Categories;
  brands: Brands;
};

export function MainNav({ categories, brands }: MainNavProps) {
  return (
    <div className='hidden gap-6 lg:flex'>
      <Link href='/' className='hidden items-center space-x-2 lg:flex'>
        <Image src='/images/logo.jpeg' alt={siteConfig.title} width={117} height={20} loading='eager' priority />
        <span className='sr-only'>Home</span>
      </Link>
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
                    <ListItem
                      key={subCategory.slug}
                      title={subCategory.title}
                      href={`/categories/${subCategory.slug}`}
                    />
                  ))}
                </ul>
                <div className='space-y-1.5'>
                  <div className='text-sm font-semibold'>Featured Brands</div>
                  <div className='grid grid-cols-4 border-[0.5px] md:w-[400px] lg:w-[500px]'>
                    {brands.map(brand => (
                      <Link key={brand.slug} href={`/brands/${brand.slug}`} className='block border-[0.5px] p-5'>
                        <Image src={brand.logo ?? ''} alt={brand.slug} width={86} height={38} />
                      </Link>
                    ))}
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            href={String(href)}
            className={cn('text-sm hover:text-primary focus:text-primary', className)}
            {...props}
          >
            {title}
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';
