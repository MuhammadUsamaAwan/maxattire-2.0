/* eslint-disable @typescript-eslint/require-await */
'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function signOut() {
  cookies().set('token', '', {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 0,
  });
  revalidateTag('cart-items');
}
