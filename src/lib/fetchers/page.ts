import 'server-only';

import { unstable_cache } from 'next/cache';
import { and, eq, isNull } from 'drizzle-orm';

import { db } from '~/db';
import { pages } from '~/db/schema';

export const getWebsitePage = unstable_cache(
  async (slug: string) => {
    {
      return db.query.pages.findFirst({
        where: and(eq(pages.slug, slug), isNull(pages.deletedAt)),
        columns: {
          content: true,
        },
      });
    }
  },
  [],
  {
    revalidate: 60,
  }
);

export const getWebsitePageSeo = unstable_cache(
  async (slug: string) => {
    {
      return db.query.pages.findFirst({
        where: and(eq(pages.slug, slug), isNull(pages.deletedAt)),
        columns: {
          metaTitle: true,
          metaDescription: true,
          metaTags: true,
          metaImg: true,
        },
      });
    }
  },
  [],
  {
    revalidate: 60,
  }
);
