import 'server-only';

import { unstable_cache } from 'next/cache';
import { eq } from 'drizzle-orm';

import { db } from '~/db';
import { carts } from '~/db/schema';
import { getUser } from '~/lib/auth';

export const getCartItems = unstable_cache(
  async () => {
    const user = await getUser();
    if (!user) {
      return [];
    }
    return db.query.carts.findMany({
      where: eq(carts.userId, user.id),
      columns: {
        id: true,
        quantity: true,
      },
      with: {
        productStock: {
          with: {
            size: {
              columns: {
                title: true,
              },
            },
            color: {
              columns: {
                title: true,
                code: true,
              },
            },
            productStockImages: {
              columns: {
                fileName: true,
              },
            },
          },
        },
        product: {
          columns: {
            title: true,
            slug: true,
          },
        },
        customizationType: {
          columns: {
            title: true,
          },
        },
      },
    });
  },
  ['cart-items'],
  {
    revalidate: 60,
    tags: ['cart-items'],
  }
);
