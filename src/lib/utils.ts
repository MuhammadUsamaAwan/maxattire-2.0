import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ZodError } from 'zod';

import { env } from '~/env';
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
