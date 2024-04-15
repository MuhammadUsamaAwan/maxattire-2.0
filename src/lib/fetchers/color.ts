import 'server-only';

import { unstable_cache } from 'next/cache';
import { and, countDistinct, eq, gt, inArray, isNotNull, isNull, lt, ne } from 'drizzle-orm';

import type { CategoriesFilters } from '~/types';
import { db } from '~/db';
import { categories, colors, productCategories, products, productStocks, sizes, stores } from '~/db/schema';

export const getFilteredColors = unstable_cache(
  async (filter?: CategoriesFilters) => {
    const brandPromise = filter?.brand
      ? db.query.stores.findFirst({
          where: and(eq(stores.slug, filter.brand), isNull(stores.deletedAt), eq(stores.status, 'active')),
          columns: {
            id: true,
          },
        })
      : undefined;
    const sizesIdsPromise = filter?.sizes
      ? db.query.sizes
          .findMany({
            where: and(inArray(sizes.slug, filter.sizes), isNull(sizes.deletedAt)),
            columns: {
              id: true,
            },
          })
          .then(sizes => sizes.map(size => size.id))
      : undefined;
    const categoryPromise = filter?.category
      ? db.query.categories.findFirst({
          where: and(eq(categories.slug, filter.category), isNull(categories.deletedAt)),
          columns: {
            id: true,
          },
        })
      : undefined;
    const [brand, sizesIds, category] = await Promise.all([brandPromise, sizesIdsPromise, categoryPromise]);
    const productsIds = await db
      .select({
        id: products.id,
      })
      .from(products)
      .innerJoin(
        productCategories,
        and(
          eq(products.id, productCategories.productId),
          filter?.maxPrice ? lt(products.sellPrice, filter.maxPrice) : undefined,
          filter?.minPrice ? gt(products.sellPrice, filter.minPrice) : undefined,
          category && eq(productCategories.categoryId, category.id),
          brand && eq(products.storeId, brand.id),
          ne(products.status, 'not-active'),
          isNull(products.deletedAt)
        )
      )
      .groupBy(products.id)
      .then(products => products.map(product => product.id));
    const filteredColors = await db
      .select({
        slug: colors.slug,
        title: colors.title,
        code: colors.code,
        productCount: countDistinct(productStocks.productId),
      })
      .from(colors)
      .innerJoin(
        productStocks,
        and(
          eq(colors.id, productStocks.colorId),
          sizesIds && inArray(productStocks.sizeId, sizesIds),
          productsIds && inArray(productStocks.productId, productsIds),
          isNull(colors.deletedAt)
        )
      )
      .groupBy(colors.id, colors.slug, colors.title, colors.code);
    return filteredColors;
  },
  ['filtered-colors'],
  {
    revalidate: 60,
  }
);

export const getProductColors = unstable_cache(
  async (productSlug: string) => {
    const product = await db.query.products.findFirst({
      where: and(eq(products.slug, productSlug), isNull(products.deletedAt), ne(products.status, 'not-active')),
      columns: {
        id: true,
      },
    });
    if (!product) return [];
    return db
      .select({
        slug: colors.slug,
        title: colors.title,
        code: colors.code,
      })
      .from(colors)
      .innerJoin(
        productStocks,
        and(
          eq(colors.id, productStocks.colorId),
          isNull(productStocks.deletedAt),
          isNotNull(productStocks.sizeId),
          eq(productStocks.productId, product.id),
          isNull(colors.deletedAt)
        )
      )
      .groupBy(colors.slug, colors.title, colors.code);
  },
  ['product-colors'],
  {
    revalidate: 60,
  }
);
