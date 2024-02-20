import 'server-only';

import { unstable_cache } from 'next/cache';
import { and, eq, inArray, isNull } from 'drizzle-orm';

import { db } from '~/db';
import { settings } from '~/db/schema';

export const getSettings = unstable_cache(
  async () => {
    const keys = ['Email', 'Phone', 'Facebook', 'Instagram', 'Twitter', 'LinkedIn'];
    const links = await db.query.settings.findMany({
      where: and(inArray(settings.key, keys), eq(settings.status, 'active'), isNull(settings.deletedAt)),
      columns: {
        value: true,
        key: true,
      },
    });
    return {
      email: links.find(s => s.key === 'Email')?.value,
      phone: links.find(s => s.key === 'Phone')?.value,
      facebook: links.find(s => s.key === 'Facebook')?.value,
      instagram: links.find(s => s.key === 'Instagram')?.value,
      twitter: links.find(s => s.key === 'Twitter')?.value,
      linkedin: links.find(s => s.key === 'LinkedIn')?.value,
    };
  },
  ['settings'],
  {
    revalidate: 60,
  }
);
