import Link from 'next/link';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';

import { getUser } from '~/lib/auth';
import { getOrders } from '~/lib/fetchers/order';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Separator } from '~/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Icons } from '~/components/icons';

import { OrderStatusBadge } from '../_components/order-status-badge';

export default async function OrdersPage() {
  const user = await getUser();
  const orders = await getOrders();

  if (!user) {
    redirect('/signin');
  }

  return (
    <div className='grid items-center gap-8 pb-8 pt-6 md:py-8'>
      <div className='grid gap-1'>
        <h1 className='text-2xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]'>Orders</h1>
        <p className='text-sm text-muted-foreground sm:text-base'>Manage your orders</p>
        <Separator className='mt-2.5' />
      </div>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.code}</TableCell>
                <TableCell>{format(order.createdAt ? new Date(order.createdAt) : new Date(), 'dd MMM yy')}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.orderStatuses[order.orderStatuses.length - 1]?.status} />
                </TableCell>
                <TableCell>{order.grandTotal}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon'>
                        <Icons.dotsVertical className='h-4 w-5 text-muted-foreground' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem>
                        <Link href={`/dashboard/orders/${order.code}`}>View Details</Link>
                      </DropdownMenuItem>
                      {order.orderStatuses[order.orderStatuses.length - 1]?.status === 'AWAITING_PAYMENT' && (
                        <DropdownMenuItem>
                          <Link href={`/payment/${order.id}`}>Pay Now</Link>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
