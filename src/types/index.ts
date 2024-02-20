import type { getBrands } from '~/lib/fetchers/brand';
import type { getCartItems } from '~/lib/fetchers/cart';
import type { getCategories } from '~/lib/fetchers/category';

export type JWTPayload = {
  id: number;
  email: string;
  name: string | null;
  image: string | null;
};

export type Categories = Awaited<ReturnType<typeof getCategories>>;
export type Brands = Awaited<ReturnType<typeof getBrands>>;
export type CartItems = Awaited<ReturnType<typeof getCartItems>>;
