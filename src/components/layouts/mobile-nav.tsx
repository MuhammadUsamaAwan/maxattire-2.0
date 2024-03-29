import { getBrands } from '~/lib/fetchers/brand';
import { getCategories } from '~/lib/fetchers/category';
import { MobileNavMenu } from '~/components/layouts/mobile-nav-menu';

export async function MobileNav() {
  const categories = await getCategories();
  const brands = await getBrands();

  return <MobileNavMenu categories={categories} brands={brands} />;
}
