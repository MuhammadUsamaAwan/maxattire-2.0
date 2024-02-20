import { ErrorCard } from '~/components/error-card';

export default function NotFound() {
  return (
    <ErrorCard
      title='Order not found'
      description='The order you are looking for does not exist'
      retryLink='/dashboard/orders'
      retryLinkText='Back to Orders'
      className='mx-auto my-10 max-w-md'
    />
  );
}
