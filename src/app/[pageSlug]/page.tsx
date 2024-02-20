import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { env } from '~/env';
import { getWebsitePage, getWebsitePageSeo } from '~/lib/fetchers/page';
import { absoluteUrl } from '~/lib/utils';

type WebsitePageProps = {
  params: {
    pageSlug: string;
  };
};

export async function generateMetadata({ params: { pageSlug } }: WebsitePageProps): Promise<Metadata> {
  const page = await getWebsitePageSeo(pageSlug);

  if (!page) {
    return {};
  }

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.metaTags,
    openGraph: {
      title: page.metaTitle ?? '',
      description: page.metaDescription ?? '',
      type: 'article',
      url: absoluteUrl(pageSlug),
      images: [
        {
          url: page.metaImg ?? '',
          width: 1200,
          height: 630,
          alt: page.metaTitle ?? '',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle ?? '',
      description: page.metaDescription ?? '',
      images: page.metaImg ? [page.metaImg] : [],
    },
  };
}

export default async function WebsitePage({ params: { pageSlug } }: WebsitePageProps) {
  const page = await getWebsitePage(pageSlug);

  if (!page) {
    notFound();
  }

  return (
    <div className='container max-w-3xl py-10'>
      <div
        className='prose max-w-full dark:prose-invert'
        dangerouslySetInnerHTML={{
          __html: page?.content ?? 'No content available for this page.',
        }}
      />
    </div>
  );
}
