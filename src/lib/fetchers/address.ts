import 'server-only';

import { unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';

import { db } from '~/db';
import { addresses } from '~/db/schema';
import { getUser } from '~/lib/auth';

export const getAddresses = unstable_cache(
  async () => {
    const user = await getUser();
    if (!user) {
      redirect('/signin');
    }
    return db.query.addresses.findMany({
      where: eq(addresses.userId, user.id),
      columns: {
        id: true,
        address: true,
        city: true,
        state: true,
        postalCode: true,
        phone: true,
      },
      orderBy: desc(addresses.createdAt),
    });
  },
  ['addresses'],
  {
    revalidate: 60,
    tags: ['addresses'],
  }
);
