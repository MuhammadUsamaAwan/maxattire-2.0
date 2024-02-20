import 'server-only';

import { unstable_cache } from 'next/cache';
import { and, eq, isNull } from 'drizzle-orm';

import { db } from '~/db';
import { products } from '~/db/schema';

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
    tags: ['products'],
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
    tags: ['products'],
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
    tags: ['products'],
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
    tags: ['products'],
  }
);
