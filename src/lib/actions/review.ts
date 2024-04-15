'use server';

import { revalidateTag } from 'next/cache';
import { and, desc, eq } from 'drizzle-orm';
import { type z } from 'zod';

import { db } from '~/db';
import { orderProducts, orders, orderStatuses, reviews } from '~/db/schema';
import { addReviewSchema } from '~/lib/validations/review';

import { getUser } from '../auth';

export async function addReview(rawInput: z.infer<typeof addReviewSchema>) {
  const { rating, review, productId, orderProductId } = addReviewSchema.parse(rawInput);
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  const order = await db.query.orders.findFirst({
    where: and(eq(orders.userId, user.id), eq(orderProducts.id, orderProductId)),
    columns: {
      id: true,
    },
    with: {
      orderProducts: {
        columns: {
          id: true,
        },
      },
      orderStatuses: {
        columns: {
          status: true,
        },
        orderBy: desc(orderStatuses.createdAt),
      },
    },
  });
  if (!order?.orderStatuses.some(status => status.status === 'PAID')) {
    throw new Error('Order not paid');
  }
  const alreadyReviewed = await db.query.reviews.findFirst({
    where: and(
      eq(reviews.orderProductId, orderProductId),
      eq(reviews.productId, productId),
      eq(reviews.userId, user.id)
    ),
    columns: {
      id: true,
    },
  });
  if (alreadyReviewed) {
    throw new Error('Already reviewed');
  }
  await db.insert(reviews).values({
    reviewType: 'PRODUCT',
    userId: user.id,
    orderProductId,
    productId,
    rating,
    status: 'PENDING',
    review,
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
  });
  revalidateTag('product-review');
  revalidateTag('order-product-review');
}
