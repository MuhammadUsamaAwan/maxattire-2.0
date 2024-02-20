import { type Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getUser } from '~/lib/auth';
import { getAddresses } from '~/lib/fetchers/address';
import { Separator } from '~/components/ui/separator';

import ManageAdresses from './_components/manage-addresses';
import { UpdateAccountForm } from './_components/update-account-form';

export const metadata: Metadata = {
  title: 'Your Account',
};

export default async function AccountPage() {
  const user = await getUser();
  const addresses = await getAddresses();

  if (!user) {
    redirect('/signin');
  }

  return (
    <div className='grid items-center gap-8 pb-8 pt-6 md:py-8'>
      <div className='grid gap-1'>
        <h1 className='text-2xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]'>Account</h1>
        <p className='max-w-[750px] text-sm text-muted-foreground sm:text-base'>Manage your account settings</p>
        <Separator className='mt-2.5' />
      </div>
      <UpdateAccountForm user={user} />
      <ManageAdresses addresses={addresses} />
    </div>
  );
}
