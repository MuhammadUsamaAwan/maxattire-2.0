import 'server-only';

import { unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';
import { and, eq, isNull, ne } from 'drizzle-orm';

import { db } from '~/db';
import { products, reviews, users } from '~/db/schema';

import { getUser } from '../auth';

export const getProductReviews = unstable_cache(
  async (slug: string) => {
    const product = await db.query.products.findFirst({
      columns: {
        id: true,
      },
      where: and(eq(products.slug, slug), isNull(products.deletedAt), ne(products.status, 'not-active')),
    });
    if (!product) return [];
    return db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        review: reviews.review,
        createdAt: reviews.createdAt,
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
        },
      })
      .from(reviews)
      .innerJoin(
        users,
        and(eq(reviews.userId, users.id), eq(reviews.productId, product.id), isNull(reviews.deletedAt))
      );
  },
  ['product-reviews'],
  {
    revalidate: 60,
    tags: ['product-reviews'],
  }
);

export const getOrderProductReview = unstable_cache(
  async (orderProductId: number, productId: number) => {
    const user = await getUser();
    if (!user) {
      redirect('/signin');
    }
    return db.query.reviews.findFirst({
      where: and(
        eq(reviews.orderProductId, orderProductId),
        eq(reviews.productId, productId),
        eq(reviews.userId, user.id)
      ),
      columns: {
        id: true,
        rating: true,
        review: true,
        createdAt: true,
      },
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  },
  ['order-product-review'],
  {
    revalidate: 60,
    tags: ['order-product-review'],
  }
);
