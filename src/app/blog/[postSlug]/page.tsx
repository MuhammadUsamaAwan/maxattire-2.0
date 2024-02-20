import { type Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

import { env } from '~/env';
import { getPost, getPostSeo } from '~/lib/fetchers/post';
import { absoluteUrl, getFileUrl } from '~/lib/utils';
import { AspectRatio } from '~/components/ui/aspect-ratio';
import { Badge } from '~/components/ui/badge';

type BlogPostProps = {
  params: {
    postSlug: string;
  };
};

export async function generateMetadata({ params: { postSlug } }: BlogPostProps): Promise<Metadata> {
  const post = await getPostSeo(postSlug);

  if (!post) {
    return {};
  }

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.metaTag,
    openGraph: {
      title: post.metaTitle ?? '',
      description: post.metaDescription ?? '',
      type: 'article',
      url: absoluteUrl(postSlug),
      images: [
        {
          url: post.metaImg ?? '',
          width: 1200,
          height: 630,
          alt: post.metaTitle ?? '',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle ?? '',
      description: post.metaDescription ?? '',
      images: post.metaImg ? [post.metaImg] : [],
    },
  };
}

export default async function BlogPost({ params: { postSlug } }: BlogPostProps) {
  const post = await getPost(postSlug);

  if (!post) {
    notFound();
  }

  return (
    <div className='container max-w-3xl py-10'>
      <div className='space-y-2'>
        <div className='text-sm text-muted-foreground'>
          {format(post.createdAt ? new Date(post.createdAt) : new Date(), 'dd MMM yy')}
        </div>
        <h1 className='inline-block text-3xl font-bold leading-tight lg:text-3xl'>{post.title}</h1>
        <div className='flex flex-wrap gap-2'>
          {post.tags?.split(',').map(tag => (
            <Badge key={tag} variant='outline' className='font-medium'>
              {tag}
            </Badge>
          ))}
        </div>
        <AspectRatio ratio={16 / 9} className='mt-2'>
          <Image
            src={getFileUrl(post.thumbnail)}
            alt={post.title}
            fill
            className='rounded-md border bg-muted'
            priority
            loading='eager'
            sizes='(min-width: 780px) 702px, 93.04vw'
          />
        </AspectRatio>
      </div>
      <div className='py-10'>
        <div
          className='prose max-w-full dark:prose-invert'
          dangerouslySetInnerHTML={{
            __html: post.description ?? 'No content available for this page.',
          }}
        />
      </div>
    </div>
  );
}
