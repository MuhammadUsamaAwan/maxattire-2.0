import type { ProductReviews } from '~/types';
import { getProductReviews } from '~/lib/fetchers/review';
import { ProductReview } from '~/components/product-review';

type ProductReviewsProps = {
  slug: string;
};

export async function ProductReviews({ slug }: ProductReviewsProps) {
  const reviews = await getProductReviews(slug);

  return reviews.length > 0 ? (
    reviews.map(review => <ProductReview key={review.id} review={review} />)
  ) : (
    <div>No reviews yet</div>
  );
}
