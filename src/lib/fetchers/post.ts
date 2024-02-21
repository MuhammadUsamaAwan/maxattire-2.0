import 'server-only';

import { unstable_cache } from 'next/cache';
import { and, desc, eq, isNull } from 'drizzle-orm';

import { db } from '~/db';
import { posts } from '~/db/schema';

export const getPosts = unstable_cache(
  async () => {
    {
      return db.query.posts.findMany({
        where: and(eq(posts.status, 'active'), isNull(posts.deletedAt)),
        columns: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
          tags: true,
          createdAt: true,
        },
        orderBy: desc(posts.createdAt),
      });
    }
  },
  ['posts'],
  {
    revalidate: 60,
  }
);

export const getPost = unstable_cache(
  async (slug: string) => {
    {
      return db.query.posts.findFirst({
        where: and(eq(posts.slug, slug), eq(posts.status, 'active'), isNull(posts.deletedAt)),
        columns: {
          id: true,
          title: true,
          thumbnail: true,
          tags: true,
          description: true,
          createdAt: true,
        },
        orderBy: desc(posts.createdAt),
      });
    }
  },
  ['post'],
  {
    revalidate: 60,
  }
);

export const getPostSeo = unstable_cache(
  async (slug: string) => {
    {
      return db.query.posts.findFirst({
        where: and(eq(posts.slug, slug), eq(posts.status, 'active'), isNull(posts.deletedAt)),
        columns: {
          metaTitle: true,
          metaDescription: true,
          metaTag: true,
          metaImg: true,
        },
      });
    }
  },
  ['post-seo'],
  {
    revalidate: 60,
  }
);
