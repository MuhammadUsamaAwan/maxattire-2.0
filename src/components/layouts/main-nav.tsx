import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { siteConfig } from '~/config/site';
import { MainNavMenu } from '~/components/layouts/main-nav-menu';
import { MainNavSkeleton } from '~/components/layouts/main-nav-skeleton';

export function MainNav() {
  return (
    <div className='hidden gap-6 lg:flex'>
      <Link href='/' className='hidden items-center space-x-2 lg:flex'>
        <Image
          src='/images/logo.jpeg'
          alt={siteConfig.title}
          width={117}
          height={20}
          loading='eager'
          priority
          sizes='117px'
        />
        <span className='sr-only'>Home</span>
      </Link>
      <Suspense fallback={<MainNavSkeleton />}>
        <MainNavMenu />
      </Suspense>
    </div>
  );
}
