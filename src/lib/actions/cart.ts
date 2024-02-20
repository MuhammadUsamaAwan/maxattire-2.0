'use server';

import { revalidateTag } from 'next/cache';
import { and, eq, isNull } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '~/db';
import { carts, products, productStocks } from '~/db/schema';
import { getUser } from '~/lib/auth';

export const addToCartSchema = z.object({
  productId: z.number().min(1),
  productStockId: z.number().min(1),
  quantity: z.number().min(1),
});

export async function addToCart(rawInput: z.infer<typeof addToCartSchema>) {
  const { productId, productStockId, quantity } = addToCartSchema.parse(rawInput);
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  const [productStock] = await db
    .select({
      id: productStocks.id,
      quantity: productStocks.id,
    })
    .from(productStocks)
    .innerJoin(
      products,
      and(
        eq(products.id, productId),
        eq(productStocks.id, productStockId),
        isNull(products.deletedAt),
        eq(products.status, 'active')
      )
    );
  if (!productStock) {
    throw new Error('Product Stock not found');
  }
  if (productStock.quantity < quantity) {
    throw new Error('Product Stock not enough');
  }
  const alreadyInCart = await db.query.carts.findFirst({
    where: and(eq(carts.userId, user.id), eq(carts.productStockId, productStockId), eq(carts.productId, productId)),
    columns: {
      id: true,
      quantity: true,
    },
  });
  if (alreadyInCart) {
    await db
      .update(carts)
      .set({ quantity: (alreadyInCart.quantity ?? 0) + quantity })
      .where(eq(carts.id, alreadyInCart.id));
  } else {
    await db.insert(carts).values({
      userId: user.id,
      productId,
      productStockId,
      quantity,
    });
  }
  revalidateTag('cart-items');
}

export const updateCartItemSchema = z.object({
  id: z.number().min(1),
  quantity: z.number().min(1),
});

export async function updateCartItem(rawInput: z.infer<typeof updateCartItemSchema>) {
  const { id, quantity } = updateCartItemSchema.parse(rawInput);
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  await db
    .update(carts)
    .set({ quantity })
    .where(and(eq(carts.id, id), eq(carts.userId, user.id)));
  revalidateTag('cart-items');
}

export const removeCartItemSchema = z.object({
  id: z.number().min(1),
});

export async function removeCartItem(rawInput: z.infer<typeof removeCartItemSchema>) {
  const { id } = removeCartItemSchema.parse(rawInput);
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  await db.delete(carts).where(and(eq(carts.id, id), eq(carts.userId, user.id)));
  revalidateTag('cart');
}
