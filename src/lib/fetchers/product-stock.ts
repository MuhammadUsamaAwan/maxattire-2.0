import 'server-only';

import { unstable_cache } from 'next/cache';
import { and, eq, isNull, ne } from 'drizzle-orm';

import { db } from '~/db';
import { colors, products, productStocks, sizes } from '~/db/schema';

export const getProductStocks = unstable_cache(
  async (productSlug: string, colorSlug?: string) => {
    const product = await db.query.products.findFirst({
      where: and(eq(products.slug, productSlug), isNull(products.deletedAt), ne(products.status, 'not-active')),
      columns: {
        id: true,
      },
    });
    if (!product) return [];
    if (!colorSlug) return [];
    const color = await db.query.colors.findFirst({
      where: and(eq(colors.slug, colorSlug), isNull(colors.deletedAt)),
      columns: {
        id: true,
      },
    });
    if (!color) return [];
    return await db
      .select({
        id: productStocks.id,
        quantity: productStocks.quantity,
        price: productStocks.price,
        color: productStocks.colorId,
        size: {
          title: sizes.title,
        },
      })
      .from(productStocks)
      .innerJoin(
        sizes,
        and(
          eq(productStocks.sizeId, sizes.id),
          isNull(sizes.deletedAt),
          eq(productStocks.colorId, color.id),
          isNull(productStocks.deletedAt),
          eq(productStocks.productId, product.id)
        )
      );
  },
  ['product-stocks'],
  {
    revalidate: 60,
  }
);
