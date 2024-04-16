'use server';

import { isWithinInterval } from 'date-fns';
import { and, eq, isNull } from 'drizzle-orm';

import { db } from '~/db';
import { coupons } from '~/db/schema';

export async function checkCouponCode(couponCode: string) {
  const coupon = await db.query.coupons.findFirst({
    where: and(
      eq(coupons.code, couponCode),
      eq(coupons.status, 'active'),
      isNull(coupons.deletedAt)
      // gt(coupons.noOfUse, 0)
    ),
    columns: {
      id: true,
      description: true,
      discount: true,
      discountType: true,
      startDate: true,
      endDate: true,
    },
  });
  if (!coupon?.startDate || !coupon?.endDate) {
    return coupon;
  }
  if (
    coupon &&
    isWithinInterval(new Date(), {
      start: coupon.startDate,
      end: coupon.endDate,
    })
  ) {
    return coupon;
  } else {
    return null;
  }
}
