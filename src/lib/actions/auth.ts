/* eslint-disable @typescript-eslint/require-await */
'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { compare, hash } from 'bcryptjs';
import { and, eq, isNull } from 'drizzle-orm';
import { SignJWT } from 'jose';
import { type z } from 'zod';

import { env } from '~/env';
import type { JWTPayload } from '~/types';
import { db } from '~/db';
import { users } from '~/db/schema';
import { signInSchema, signUpSchema } from '~/lib/validations/auth';

export async function signInWithCredentials(rawInput: z.infer<typeof signInSchema>) {
  const { email, password } = signInSchema.parse(rawInput);
  const user = await db.query.users.findFirst({
    where: and(eq(users.email, email), isNull(users.deletedAt)),
    columns: {
      id: true,
      email: true,
      password: true,
      status: true,
      image: true,
      name: true,
    },
  });
  if (!user || !user.password) {
    throw new Error('Invalid email or password');
  }
  const valid = await compare(password, user.password);
  if (!valid) {
    throw new Error('Invalid email or password');
  }
  if (user.status === 'not-active') {
    throw new Error('User is not active');
  }
  if (user.status === 'blocked') {
    throw new Error('User is blocked');
  }
  await setAccessToken({ id: user.id, email: user.email, name: user.name, image: user.image });
  revalidatePath('/', 'layout');
}

export async function signUpWithCredentials(rawInput: z.infer<typeof signUpSchema>) {
  const { email, password } = signUpSchema.parse(rawInput);
  const hashed = await hash(password, 10);
  try {
    await db.insert(users).values({
      email,
      password: hashed,
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    });
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      columns: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    await setAccessToken({ id: user.id, email: user.email, name: user.name, image: user.image });
    revalidatePath('/', 'layout');
  } catch (error) {
    if (
      typeof error === 'object' &&
      error &&
      'code' in error &&
      typeof error.code === 'string' &&
      error.code === 'ER_DUP_ENTRY'
    ) {
      throw new Error('Email is already in use');
    }
    throw error;
  }
}

export async function signOut() {
  cookies().set('token', '', {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 0,
  });
  revalidatePath('/', 'layout');
}

export async function setAccessToken(jwtPayload: JWTPayload) {
  const accessToken = await new SignJWT(jwtPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15d')
    .sign(new TextEncoder().encode(env.AUTH_SECRET));

  cookies().set('token', accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1296000,
  });
}
