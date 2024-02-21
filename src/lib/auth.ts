import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

import { env } from '~/env';
import type { JWTPayload } from '~/types';

export const getUser = cache(async () => {
  const token = cookies().get('token')?.value;
  if (!token) return null;
  try {
    const user = await jwtVerify(token, new TextEncoder().encode(env.AUTH_SECRET));
    return user.payload as JWTPayload;
  } catch (error) {
    return null;
  }
});
