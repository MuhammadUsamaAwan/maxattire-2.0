import { Suspense } from 'react';
import { type Metadata } from 'next';

import { CardSkeleton } from '~/components/card-skeleton';
import { PageHeader } from '~/components/page-header';

import { Posts } from './_components/posts';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read the latest articles from our blog',
};

export default function BlogPosts() {
  return (
    <div className='container py-10'>
      <PageHeader title='Blog' description='Read the latest articles from our blog' />
      <Suspense
        fallback={
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <CardSkeleton key={i} />
              ))}
          </div>
        }
      >
        <Posts />
      </Suspense>
    </div>
  );
}
