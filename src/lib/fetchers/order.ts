import 'server-only';

import { unstable_cache } from 'next/cache';
import { and, desc, eq } from 'drizzle-orm';

import { db } from '~/db';
import { orders } from '~/db/schema';
import { getUser } from '~/lib/auth';

export const getOrders = unstable_cache(
  async () => {
    const user = await getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }
    return db.query.orders.findMany({
      where: eq(orders.userId, user.id),
      columns: {
        id: true,
        code: true,
        grandTotal: true,
        createdAt: true,
      },
      with: {
        orderStatuses: {
          columns: {
            status: true,
          },
        },
      },
      orderBy: desc(orders.createdAt),
    });
  },
  ['orders'],
  {
    revalidate: 60,
    tags: ['orders'],
  }
);

export const getOrder = unstable_cache(
  async (code: string) => {
    const user = await getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }
    return db.query.orders.findFirst({
      where: and(eq(orders.userId, user.id), eq(orders.code, code)),
      columns: {
        id: true,
        code: true,
        grandTotal: true,
        createdAt: true,
      },
      with: {
        orderStatuses: {
          columns: {
            status: true,
          },
        },
        orderProducts: {
          columns: {
            id: true,
            price: true,
            quantity: true,
          },
          with: {
            productStock: {
              columns: {
                id: true,
              },
              with: {
                size: {
                  columns: {
                    title: true,
                  },
                },
                color: {
                  columns: {
                    title: true,
                  },
                },
              },
            },
            product: {
              columns: {
                id: true,
                title: true,
                slug: true,
                thumbnail: true,
              },
            },
          },
        },
      },
      orderBy: desc(orders.createdAt),
    });
  },
  ['order'],
  {
    revalidate: 60,
  }
);
