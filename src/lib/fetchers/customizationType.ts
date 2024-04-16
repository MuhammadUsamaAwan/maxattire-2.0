'use server';

import { unstable_cache } from 'next/cache';
import { and, eq } from 'drizzle-orm';

import { db } from '~/db';
import { customizationTypes } from '~/db/schema';

export const getCustomizationTypes = unstable_cache(
  async () => {
    return db
      .select({
        id: customizationTypes.id,
        title: customizationTypes.title,
      })
      .from(customizationTypes)
      .where(and(eq(customizationTypes.status, 'active')));
  },
  ['customizationTypes'],
  {
    revalidate: 60,
  }
);
