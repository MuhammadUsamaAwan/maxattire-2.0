'use server';

import { unstable_cache } from 'next/cache';
import { and, eq, isNull } from 'drizzle-orm';

import { db } from '~/db';
import { categories, couponCategories, coupons } from '~/db/schema';

export const getCoupons = unstable_cache(
  async () => {
    return db
      .select({
        id: coupons.id,
        code: coupons.code,
        discountType: coupons.discountType,
        discount: coupons.discount,
        endDate: coupons.endDate,
        file: coupons.file,
        category: {
          slug: categories.slug,
          title: categories.title,
        },
      })
      .from(coupons)
      .where(and(isNull(coupons.deletedAt), eq(coupons.status, 'active')))
      .innerJoin(couponCategories, eq(couponCategories.couponId, coupons.id))
      .innerJoin(categories, eq(categories.id, couponCategories.categoryId));
  },
  ['coupons'],
  {
    revalidate: 60,
  }
);
