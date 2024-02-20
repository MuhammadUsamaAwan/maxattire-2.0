import 'server-only';

import { unstable_cache } from 'next/cache';
import { and, eq, isNull } from 'drizzle-orm';

import { db } from '~/db';
import { categories } from '~/db/schema';

export const getCategories = unstable_cache(
  async () => {
    return db.query.categories.findMany({
      where: and(
        eq(categories.type, 'product'),
        eq(categories.status, 'active'),
        isNull(categories.deletedAt),
        isNull(categories.parentId)
      ),
      columns: {
        title: true,
        slug: true,
      },
      with: {
        children: {
          columns: {
            title: true,
            slug: true,
          },
        },
      },
    });
  },
  ['categories'],
  {
    revalidate: 60,
    tags: ['categories'],
  }
);
