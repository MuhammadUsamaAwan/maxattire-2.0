import { ErrorCard } from '~/components/error-card';

export default function NotFound() {
  return (
    <ErrorCard
      title='Resource not found'
      description='The resource you are looking for does not exist'
      retryLink='/'
      retryLinkText='Back to Home'
      className='mx-auto my-10 max-w-md'
    />
  );
}
