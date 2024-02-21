import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';

import { Skeleton } from './ui/skeleton';

type TableSkeletonProps = {
  header: number;
  items: number;
};

export function TableSkeleton({ header, items }: TableSkeletonProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Array(header)
            .fill(null)
            .map((_, i) => (
              <TableHead key={i} className='text-center'>
                <Skeleton className='mx-auto h-8 w-1/2' />
              </TableHead>
            ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array(items)
          .fill(null)
          .map((_, i) => (
            <TableRow key={i} className='text-center'>
              {Array(header)
                .fill(null)
                .map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className='mx-auto h-8 w-3/4' />
                  </TableCell>
                ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
