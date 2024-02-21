import { Suspense } from 'react';

import { Skeleton } from '~/components/ui/skeleton';
import { CartSheet } from '~/components/checkout/cart-sheet';
import { MainNav } from '~/components/layouts/main-nav';
import { MobileNav } from '~/components/layouts/mobile-nav';
import { UserDropdown } from '~/components/layouts/user-dropdown';
import { ProductSearch } from '~/components/products-search';

export function SiteHeader() {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background'>
      <div className='container flex h-16 items-center'>
        <MainNav />
        <Suspense fallback={<Skeleton className='h-7 w-9' />}>
          <MobileNav />
        </Suspense>
        <div className='flex flex-1 items-center justify-end space-x-4'>
          <nav className='flex items-center space-x-2'>
            <ProductSearch />
            <Suspense fallback={<Skeleton className='size-9' />}>
              <CartSheet />
            </Suspense>
            <Suspense fallback={<Skeleton className='size-8' />}>
              <UserDropdown />
            </Suspense>
          </nav>
        </div>
      </div>
    </header>
  );
}
