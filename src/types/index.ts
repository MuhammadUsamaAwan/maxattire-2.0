import type { getAddresses } from '~/lib/fetchers/address';
import type { getBrands } from '~/lib/fetchers/brand';
import type { getCartItems } from '~/lib/fetchers/cart';
import type { getCategories } from '~/lib/fetchers/category';
import type { getProductColors } from '~/lib/fetchers/color';
import type { getOrder } from '~/lib/fetchers/order';
import type { getNewProducts } from '~/lib/fetchers/product';
import type { getProductStocks } from '~/lib/fetchers/product-stock';
import type { getProductReviews } from '~/lib/fetchers/review';

export type JWTPayload = {
  id: number;
  email: string;
  name: string | null;
  image: string | null;
};

export type CategoriesFilters = {
  q?: string;
  colors?: string[];
  sizes?: string[];
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
};

export type CategoriesSearchParams = {
  q: string | undefined;
  sizes: string | undefined;
  colors: string | undefined;
  category: string | undefined;
  min_price: string | undefined;
  max_price: string | undefined;
  sort: string | undefined;
  page: string | undefined;
};

export type FilteredCategory = {
  title: string;
  slug: string;
  productCount: number;
  children: {
    title: string;
    slug: string;
    productCount: number;
  }[];
};

export type Categories = Awaited<ReturnType<typeof getCategories>>;
export type Brands = Awaited<ReturnType<typeof getBrands>>;
export type CartItems = Awaited<ReturnType<typeof getCartItems>>;
export type Products = Awaited<ReturnType<typeof getNewProducts>>;
export type Addresses = Awaited<ReturnType<typeof getAddresses>>;
export type Order = Awaited<ReturnType<typeof getOrder>>;
export type ProductReviews = Awaited<ReturnType<typeof getProductReviews>>;
export type ProductColors = Awaited<ReturnType<typeof getProductColors>>;
export type ProductStocks = Awaited<ReturnType<typeof getProductStocks>>;
