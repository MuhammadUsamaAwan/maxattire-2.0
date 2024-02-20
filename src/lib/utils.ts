import { clsx, type ClassValue } from 'clsx';
import { isUndefined, omitBy } from 'lodash';
import { twMerge } from 'tailwind-merge';
import { ZodError } from 'zod';

import { env } from '~/env';
import type { CategoriesSearchParams } from '~/types';
import { toast } from '~/components/ui/toaster';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path = '') {
  return env.NEXT_PUBLIC_APP_URL + path;
}

export function getInitials(name: string | null | undefined) {
  return (
    name
      ?.split(' ')
      .map(n => n[0]?.toUpperCase())
      .join('')
      .slice(0, 2) ?? ''
  );
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: 'USD' | 'EUR' | 'GBP' | 'BDT';
    notation?: Intl.NumberFormatOptions['notation'];
  } = {}
) {
  const { currency = 'USD', notation = 'compact' } = options;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation,
  }).format(Number(price));
}

export function catchError(err: unknown) {
  if (err instanceof ZodError) {
    const errors = err.issues.map(issue => {
      return issue.message;
    });
    return toast.error(errors.join('\n'));
  } else if (err instanceof Error) {
    return toast.error(err.message);
  } else {
    return toast.error('Something went wrong, please try again later.');
  }
}

export function getFileUrl(file?: string | null | undefined) {
  return `${env.NEXT_PUBLIC_FILE_URL}/${file}`;
}

export function unslugify(slug: string) {
  return slug.replace(/[-_]/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export function getSearchParams(
  searchParams: CategoriesSearchParams,
  partialSearchParams: Partial<CategoriesSearchParams>
) {
  const newSearchParams = new URLSearchParams(
    omitBy(
      {
        ...searchParams,
        ...partialSearchParams,
      },
      isUndefined
    ) as Record<string, string>
  );
  return `?${newSearchParams.toString()}`;
}

export function getAvgRating(
  reviews: {
    rating?: number | null;
  }[]
) {
  if (reviews.length > 0) return reviews.reduce((acc, curr) => acc + (curr.rating ?? 0), 0) / reviews.length;
  else return 0;
}
