import { format } from 'date-fns';

import { type ProductReviews } from '~/types';
import { getInitials } from '~/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Icons } from '~/components/icons';
import { Rating } from '~/components/rating';

type ProductReviewProps = {
  review: ProductReviews[number];
};

export function ProductReview({ review }: ProductReviewProps) {
  return (
    <div key={review.id} className='space-y-1'>
      <div className='flex items-center space-x-2'>
        <Avatar className='size-11'>
          <AvatarImage src={review.user?.image ?? ''} alt={review.user?.name ?? ''} />
          <AvatarFallback>{getInitials(review.user?.name)}</AvatarFallback>
        </Avatar>
        <div>
          <div className='font-semibold'>{review.user?.name}</div>
          <div className='flex items-center space-x-3 text-sm'>
            <div>Reviewed on {format(review.createdAt ? new Date(review.createdAt) : new Date(), 'dd MMM yy')}</div>
            <span>|</span>
            <div className='flex items-center space-x-1.5'>
              <Icons.checkCircle className='size-4 text-green-600' />
              <div>Verified Purchase</div>
            </div>
          </div>
        </div>
      </div>
      <Rating rating={review.rating} />
      <p>{review.review}</p>
    </div>
  );
}
