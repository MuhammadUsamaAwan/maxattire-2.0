import 'server-only';

import { unstable_cache } from 'next/cache';
import { and, eq, isNull } from 'drizzle-orm';

import { db } from '~/db';
import { products, productSpecs, productSpecTypes } from '~/db/schema';

export const getSizeChart = unstable_cache(
  async (productSlug: string) => {
    const product = await db.query.products.findFirst({
      columns: {
        id: true,
      },
      where: and(eq(products.slug, productSlug), isNull(products.deletedAt), eq(products.status, 'active')),
    });
    if (!product) return [];
    return db
      .select({
        size: productSpecs.size,
        value: productSpecs.value,
        title: productSpecTypes.title,
      })
      .from(productSpecs)
      .innerJoin(
        productSpecTypes,
        and(eq(productSpecTypes.productId, product.id), eq(productSpecTypes.id, productSpecs.productSpecTypeId))
      );
  },
  ['size-chart'],
  {
    revalidate: 60,
  }
);
