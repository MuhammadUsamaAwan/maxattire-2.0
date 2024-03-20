import { Input } from '~/components/ui/input';

export function ProductSearch() {
  return (
    <form method='GET' action='/search'>
      <Input placeholder='Search Store...' name='q' className='w-32 sm:w-56' />
    </form>
  );
}
