'use server';

import { unstable_cache } from 'next/cache';
import { and, eq, isNotNull, isNull } from 'drizzle-orm';

import { db } from '~/db';
import { colors, products, productStockImages, productStocks } from '~/db/schema';

export const getProductStockImages = unstable_cache(
  async (productSlug: string, colorSlug?: string) => {
    const product = await db.query.products.findFirst({
      where: and(eq(products.slug, productSlug), isNull(products.deletedAt), eq(products.status, 'active')),
      columns: {
        id: true,
      },
    });
    if (!product) return [];
    if (!colorSlug) {
      return db
        .select({ fileName: productStockImages.fileName })
        .from(productStockImages)
        .where(and(eq(productStockImages.productId, product.id), isNotNull(productStockImages.fileName)))
        .limit(5);
    }
    const color = await db.query.colors.findFirst({
      where: and(eq(colors.slug, colorSlug), isNull(colors.deletedAt)),
      columns: {
        id: true,
      },
    });
    if (!color) {
      return db
        .select({ fileName: productStockImages.fileName })
        .from(productStockImages)
        .where(and(eq(productStockImages.productId, product.id), isNotNull(productStockImages.fileName)))
        .limit(5);
    }
    return db
      .select({
        fileName: productStockImages.fileName,
      })
      .from(productStockImages)
      .innerJoin(
        productStocks,
        and(
          eq(productStockImages.productStockId, productStocks.id),
          eq(productStocks.colorId, color.id),
          isNull(productStocks.deletedAt),
          eq(productStockImages.productId, product.id),
          isNotNull(productStockImages.fileName)
        )
      )
      .limit(5);
  },
  ['product-stock-images'],
  {
    revalidate: 60,
  }
);
