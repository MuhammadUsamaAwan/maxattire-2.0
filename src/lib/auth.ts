import 'server-only';

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

import { env } from '~/env';
import type { JWTPayload } from '~/types';

export async function getUser() {
  const token = cookies().get('token')?.value;
  if (!token) return null;
  try {
    const user = await jwtVerify(token, new TextEncoder().encode(env.AUTH_SECRET));
    return user.payload as JWTPayload;
  } catch (error) {
    return null;
  }
}
