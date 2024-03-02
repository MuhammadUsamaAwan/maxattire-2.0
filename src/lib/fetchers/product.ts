import 'server-only';

import { unstable_cache } from 'next/cache';
import { and, asc, desc, eq, gt, inArray, isNull, lt, ne } from 'drizzle-orm';

import type { CategoriesFilters } from '~/types';
import { db } from '~/db';
import { categories, colors, productCategories, products, productStocks, sizes, stores } from '~/db/schema';

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
    const brandPromise = filter?.brand
      ? db.query.stores.findFirst({
          where: eq(stores.slug, filter.brand),
          columns: {
            id: true,
          },
        })
      : undefined;
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
    const [brand, sizesIds, colorsIds, category] = await Promise.all([
      brandPromise,
      sizesIdsPromise,
      colorsIdsPromise,
      categoryPromise,
    ]);
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
          isNull(products.deletedAt),
          brand && eq(products.storeId, brand.id)
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
  ['filtered-products'],
  {
    revalidate: 60,
  }
);

export const getProductSlugTitle = unstable_cache(
  async (id: number) => {
    return db.query.products.findFirst({
      where: eq(products.id, id),
      columns: {
        title: true,
        slug: true,
      },
    });
  },
  ['product-slug-title'],
  { revalidate: 60 }
);

export const getRelatedProducts = unstable_cache(
  async (slug: string) => {
    const product = await db.query.products.findFirst({
      columns: {
        id: true,
      },
      where: eq(products.slug, slug),
    });
    if (!product) {
      return [];
    }
    const productCategoriesIds = await db.query.productCategories
      .findMany({
        columns: {
          categoryId: true,
        },
        where: eq(productCategories.productId, product.id),
      })
      .then(categories => categories.map(category => category.categoryId));
    const productIds = await db.query.productCategories
      .findMany({
        columns: {
          productId: true,
        },
        where: and(
          inArray(productCategories.categoryId, productCategoriesIds),
          ne(productCategories.productId, product.id)
        ),
      })
      .then(products => products.map(product => product.productId));
    if (!productIds.length) {
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
        where: and(isNull(products.deletedAt), eq(products.status, 'active')),
      });
    }
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
      where: and(isNull(products.deletedAt), eq(products.status, 'active'), inArray(products.id, productIds)),
    });
  },
  ['related-products'],
  { revalidate: 60 }
);

export const getProduct = unstable_cache(
  async (slug: string) => {
    return db.query.products.findFirst({
      where: and(eq(products.slug, slug), isNull(products.deletedAt), eq(products.status, 'active')),
      columns: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
        sellPrice: true,
        discount: true,
        tax: true,
        description: true,
        sku: true,
      },
      with: {
        productStocks: {
          with: {
            color: {
              columns: {
                title: true,
                slug: true,
                code: true,
              },
            },
          },
          columns: {
            id: true,
          },
        },
        reviews: {
          columns: {
            rating: true,
          },
        },
      },
    });
  },
  ['product'],
  { revalidate: 60 }
);

export const getProductSeo = unstable_cache(
  async (slug: string) => {
    return db.query.products.findFirst({
      where: and(eq(products.slug, slug), isNull(products.deletedAt), eq(products.status, 'active')),
      columns: {
        metaTitle: true,
        metaDescription: true,
        metaTag: true,
        metaImg: true,
      },
    });
  },
  ['product-seo'],
  { revalidate: 60 }
);
