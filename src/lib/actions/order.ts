'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { eq } from 'drizzle-orm';
import { type z } from 'zod';

import { siteConfig } from '~/config/site';
import { db } from '~/db';
import { addresses, carts, orderProducts, orders, orderStatuses } from '~/db/schema';
import { getUser } from '~/lib/auth';
import { createOrderSchema } from '~/lib/validations/order';

import { sendOrderEmail } from '../email';

export async function createOrder(rawInput: z.infer<typeof createOrderSchema>) {
  const { addressId } = createOrderSchema.parse(rawInput);
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  const address = await db.query.addresses.findFirst({
    where: eq(addresses.id, addressId),
    columns: {
      state: true,
      city: true,
      address: true,
      phone: true,
      postalCode: true,
    },
  });
  if (!address) {
    throw new Error('Address not found');
  }
  const cart = await db.query.carts.findMany({
    where: eq(carts.userId, user.id),
    columns: {
      quantity: true,
      tax: true,
      discount: true,
    },
    with: {
      product: {
        columns: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
        },
      },
      productStock: {
        columns: {
          id: true,
          price: true,
        },
        with: {
          size: {
            columns: {
              id: true,
              title: true,
            },
          },
          color: {
            columns: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });
  if (cart.length === 0) {
    throw new Error('Cart is empty');
  }
  const grandTotal = cart.reduce((acc, curr) => acc + (curr.productStock?.price ?? 0) * (curr?.quantity ?? 0), 0);
  const code = `${siteConfig.title.slice(0, 4)}-${Math.floor(100000 + Math.random() * 900000)}-${Date.now()}`;
  const [order] = await db.insert(orders).values({
    userId: user.id,
    addressId,
    code,
    grandTotal,
    tax: 0,
    paymentStatus: 'not-paid',
  });
  const orderId = order.insertId;
  const orderProductPromises = cart.map(cart => {
    return db.insert(orderProducts).values({
      orderId,
      productId: cart.product?.id,
      productStockId: cart.productStock?.id as number,
      sizeId: cart.productStock?.id,
      colorId: cart.productStock?.id,
      quantity: cart.quantity,
      price: cart.productStock?.price,
      tax: cart.tax,
      discount: cart.discount,
    });
  });
  const orderStatusPromise = db.insert(orderStatuses).values({
    orderId,
    status: 'AWAITING_PAYMENT',
  });
  const sendOrderEmailPromise = sendOrderEmail({
    to: user.email,
    code,
    grandTotal,
    orderProducts: cart.map(cart => ({
      price: cart.productStock?.price ?? 0,
      quantity: cart.quantity ?? 0,
      product: {
        title: cart.product?.title ?? '',
        slug: cart.product?.slug ?? '',
        thumbnail: cart.product?.thumbnail ?? '',
      },
      productStock: {
        size: {
          title: cart.productStock?.size?.title ?? '',
        },
        color: {
          title: cart.productStock?.color?.title ?? '',
        },
      },
    })),
    address,
  });
  const deleteCartPromise = db.delete(carts).where(eq(carts.userId, user.id));

  await Promise.all([...orderProductPromises, orderStatusPromise, deleteCartPromise, sendOrderEmailPromise]);
  revalidateTag('cart-items');
  revalidateTag('orders');
  revalidatePath(`dashboard/orders/${code}`);
  revalidatePath(`payment/${code}`);
  return code;
}
