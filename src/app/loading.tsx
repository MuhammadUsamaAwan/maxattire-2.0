import { Icons } from '~/components/icons';

export default function Loading() {
  return (
    <div className='grid place-content-center py-20'>
      <Icons.spinner className='size-16 animate-spin' />
    </div>
  );
}
