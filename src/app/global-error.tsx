'use client';

import * as React from 'react';

import { ErrorCard } from '~/components/error-card';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorCard title={error.name} description={error.message} reset={reset} className='mx-auto mt-20 max-w-md' />;
}
