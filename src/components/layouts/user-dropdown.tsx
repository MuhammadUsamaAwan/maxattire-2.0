import Link from 'next/link';

import { signOut } from '~/lib/actions/auth';
import { getUser } from '~/lib/auth';
import { getInitials } from '~/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button, buttonVariants } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Icons } from '~/components/icons';

export async function UserDropdown() {
  const user = await getUser();

  if (user)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='secondary' className='relative size-8 rounded-full'>
            <Avatar className='size-8'>
              <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
              <AvatarFallback>{getInitials(user.name ?? user.email)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm font-medium leading-none'>{user.name}</p>
              <p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href='/dashboard/orders'>
                <Icons.dashboard className='mr-2 size-4' aria-hidden='true' />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/dashboard/account'>
                <Icons.settings className='mr-2 size-4' aria-hidden='true' />
                Settings
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <form action={signOut} className='w-full'>
              <button className='inline-flex w-full items-center'>
                <Icons.logout className='mr-2 size-4' aria-hidden='true' />
                Log out
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

  return (
    <Link
      href='/signin'
      className={buttonVariants({
        size: 'sm',
      })}
    >
      Sign In
      <span className='sr-only'>Sign In</span>
    </Link>
  );
}
