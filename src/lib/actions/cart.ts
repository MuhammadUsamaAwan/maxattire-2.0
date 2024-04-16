'use server';

import { revalidateTag } from 'next/cache';
import { and, eq, isNull } from 'drizzle-orm';
import { type z } from 'zod';

import { db } from '~/db';
import { carts, products, productStocks } from '~/db/schema';
import { getUser } from '~/lib/auth';
import { addToCartSchema, removeCartItemSchema, updateCartItemSchema } from '~/lib/validations/cart';

export async function addToCart(rawInput: z.infer<typeof addToCartSchema>) {
  const { productId, productStockId, quantity, customizationTypeId } = addToCartSchema.parse(rawInput);
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
      customizationTypeId: true,
    },
  });
  if (alreadyInCart) {
    if (alreadyInCart?.customizationTypeId !== customizationTypeId) {
      throw new Error('Decoration type does not match');
    }
    await db
      .update(carts)
      .set({
        quantity: (alreadyInCart.quantity ?? 0) + quantity,
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      })
      .where(eq(carts.id, alreadyInCart.id));
  } else {
    await db.insert(carts).values({
      userId: user.id,
      productId,
      productStockId,
      quantity,
      customizationTypeId,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    });
  }
  revalidateTag('cart-items');
}

export async function updateCartItem(rawInput: z.infer<typeof updateCartItemSchema>) {
  const { id, quantity } = updateCartItemSchema.parse(rawInput);
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  await db
    .update(carts)
    .set({ quantity, updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ') })
    .where(and(eq(carts.id, id), eq(carts.userId, user.id)));
  revalidateTag('cart-items');
}

export async function removeCartItem(rawInput: z.infer<typeof removeCartItemSchema>) {
  const { id } = removeCartItemSchema.parse(rawInput);
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  await db.delete(carts).where(and(eq(carts.id, id), eq(carts.userId, user.id)));
  revalidateTag('cart-items');
}
