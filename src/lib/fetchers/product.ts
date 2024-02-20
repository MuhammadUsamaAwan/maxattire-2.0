import 'server-only';

import { unstable_cache } from 'next/cache';
import { and, asc, desc, eq, gt, inArray, isNull, lt } from 'drizzle-orm';

import type { CategoriesFilters } from '~/types';
import { db } from '~/db';
import { categories, colors, productCategories, products, productStocks, sizes } from '~/db/schema';

export const getNewProducts = unstable_cache(
  async () => {
    {
      return db.query.products.findMany({
        columns: {
          title: true,
          slug: true,
          thumbnail: true,
          sellPrice: true,
          discount: true,
        },
        with: {
          productStocks: {
            columns: {
              id: true,
            },
            with: {
              color: {
                columns: {
                  title: true,
                  code: true,
                },
              },
            },
          },
          reviews: {
            columns: {
              rating: true,
            },
          },
        },
        limit: 8,
        where: and(eq(products.isNewarrival, 1), isNull(products.deletedAt), eq(products.status, 'active')),
      });
    }
  },
  ['new-products'],
  {
    revalidate: 60,
  }
);

export const getTopProducts = unstable_cache(
  async () => {
    {
      return db.query.products.findMany({
        columns: {
          title: true,
          slug: true,
          thumbnail: true,
          sellPrice: true,
          discount: true,
        },
        with: {
          productStocks: {
            columns: {
              id: true,
            },
            with: {
              color: {
                columns: {
                  title: true,
                  code: true,
                },
              },
            },
          },
          reviews: {
            columns: {
              rating: true,
            },
          },
        },
        limit: 8,
        where: and(eq(products.isTopselling, 1), isNull(products.deletedAt), eq(products.status, 'active')),
      });
    }
  },
  ['top-products'],
  {
    revalidate: 60,
  }
);

export const getFeaturedProducts = unstable_cache(
  async () => {
    {
      return db.query.products.findMany({
        columns: {
          title: true,
          slug: true,
          thumbnail: true,
          sellPrice: true,
          discount: true,
        },
        with: {
          productStocks: {
            columns: {
              id: true,
            },
            with: {
              color: {
                columns: {
                  title: true,
                  code: true,
                },
              },
            },
          },
          reviews: {
            columns: {
              rating: true,
            },
          },
        },
        limit: 8,
        where: and(eq(products.isFeatured, 1), isNull(products.deletedAt), eq(products.status, 'active')),
      });
    }
  },
  ['featured-products'],
  {
    revalidate: 60,
  }
);

export const getWholeSaleProducts = unstable_cache(
  async () => {
    {
      return db.query.products.findMany({
        columns: {
          title: true,
          slug: true,
          thumbnail: true,
          sellPrice: true,
          discount: true,
        },
        with: {
          productStocks: {
            columns: {
              id: true,
            },
            with: {
              color: {
                columns: {
                  title: true,
                  code: true,
                },
              },
            },
          },
          reviews: {
            columns: {
              rating: true,
            },
          },
        },
        limit: 8,
        where: and(eq(products.isWholesale, 1), isNull(products.deletedAt), eq(products.status, 'active')),
      });
    }
  },
  ['wholesale-products'],
  {
    revalidate: 60,
  }
);

export const getFilteredProducts = unstable_cache(
  async (filter?: CategoriesFilters) => {
    const colorsIdsPromise = filter?.colors
      ? db.query.colors
          .findMany({
            where: and(inArray(colors.slug, filter.colors), isNull(colors.deletedAt)),
            columns: {
              id: true,
            },
          })
          .then(colors => colors.map(color => color.id))
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
    const [sizesIds, colorsIds, category] = await Promise.all([sizesIdsPromise, colorsIdsPromise, categoryPromise]);
    const productIds = await db
      .select({
        id: products.id,
      })
      .from(products)
      .innerJoin(productCategories, eq(products.id, productCategories.productId))
      .innerJoin(productStocks, eq(products.id, productStocks.productId))
      .where(
        and(
          filter?.maxPrice ? lt(products.sellPrice, filter.maxPrice) : undefined,
          filter?.minPrice ? gt(products.sellPrice, filter.minPrice) : undefined,
          category && eq(productCategories.categoryId, category.id),
          sizesIds && inArray(productStocks.sizeId, sizesIds),
          colorsIds && inArray(productStocks.colorId, colorsIds),
          eq(products.status, 'active'),
          isNull(products.deletedAt)
        )
      )
      .groupBy(products.id)
      .then(products => products.map(product => product.id));
    const productsResult = await db.query.products.findMany({
      columns: {
        title: true,
        slug: true,
        thumbnail: true,
        sellPrice: true,
        discount: true,
      },
      with: {
        productStocks: {
          columns: {
            id: true,
          },
          with: {
            color: {
              columns: {
                title: true,
                code: true,
              },
            },
          },
        },
        reviews: {
          columns: {
            rating: true,
          },
        },
      },
      where: inArray(products.id, productIds),
      orderBy: filter?.sort === 'pricedesc' ? desc(products.sellPrice) : asc(products.sellPrice),
      offset: filter?.page ? 12 * filter.page : undefined,
      limit: 12,
    });
    return { products: productsResult, productsCount: productIds.length };
  },
  [],
  {
    revalidate: 60,
  }
);
