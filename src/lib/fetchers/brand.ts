import 'server-only';

import { unstable_cache } from 'next/cache';
import { and, eq, isNull } from 'drizzle-orm';

import { db } from '~/db';
import { stores } from '~/db/schema';

export const getBrands = unstable_cache(
  async () => {
    return db.query.stores.findMany({
      where: and(eq(stores.status, 'active'), isNull(stores.deletedAt)),
      columns: {
        logo: true,
        slug: true,
      },
    });
  },
  ['brands'],
  {
    revalidate: 60,
  }
);

export const getBrandTitleDescription = unstable_cache(
  async (slug: string) => {
    return db.query.stores.findFirst({
      where: eq(stores.slug, slug),
      columns: {
        name: true,
        metaDescription: true,
      },
    });
  },
  ['brandTitleDescription'],
  { revalidate: 60 }
);
