import type { ProductReviews } from '~/types';
import { ProductReview } from '~/components/product-review';

type ProductReviewsProps = {
  reviews: ProductReviews;
};

export function ProductReviews({ reviews }: ProductReviewsProps) {
  return (
    <div className='pt-6 md:pt-10'>
      <h2 className='text-2xl font-bold'>Product Reviews</h2>
      <div className='space-y-4 pt-4'>
        {reviews.length > 0 ? (
          reviews.map(review => <ProductReview key={review.id} review={review} />)
        ) : (
          <div>No reviews yet</div>
        )}
      </div>
    </div>
  );
}
