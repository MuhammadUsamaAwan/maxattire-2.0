import type { getBrands } from '~/lib/fetchers/brand';
import type { getCartItems } from '~/lib/fetchers/cart';
import type { getCategories } from '~/lib/fetchers/category';
import type { getNewProducts } from '~/lib/fetchers/product';

export type JWTPayload = {
  id: number;
  email: string;
  name: string | null;
  image: string | null;
};

export type Categories = Awaited<ReturnType<typeof getCategories>>;
export type Brands = Awaited<ReturnType<typeof getBrands>>;
export type CartItems = Awaited<ReturnType<typeof getCartItems>>;
export type Products = Awaited<ReturnType<typeof getNewProducts>>;
