'use server';

import { eq } from 'drizzle-orm';
import { type z } from 'zod';

import { db } from '~/db';
import { users } from '~/db/schema';
import { setAccessToken } from '~/lib/actions/auth';
import { getUser } from '~/lib/auth';
import { updateUserSchema } from '~/lib/validations/user';

export async function updateUser(rawInput: z.infer<typeof updateUserSchema>) {
  const { name } = updateUserSchema.parse(rawInput);
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  await db
    .update(users)
    .set({ name, updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ') })
    .where(eq(users.id, user.id));
  await setAccessToken({ ...user, name });
}
