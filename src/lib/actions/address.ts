'use server';

import { revalidateTag } from 'next/cache';
import { type z } from 'zod';

import { db } from '~/db';
import { addresses } from '~/db/schema';
import { getUser } from '~/lib/auth';
import { addAddressSchema } from '~/lib/validations/address';

export async function addAddress(rawInput: z.infer<typeof addAddressSchema>) {
  const { address, city, state, postalCode, phone } = addAddressSchema.parse(rawInput);
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  const [newAddress] = await db.insert(addresses).values({
    address,
    city,
    state,
    postalCode,
    phone,
    userId: user.id,
  });
  revalidateTag('addresses');
  return newAddress.insertId;
}
