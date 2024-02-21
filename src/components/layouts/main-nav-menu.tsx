import { getBrands } from '~/lib/fetchers/brand';
import { getCategories } from '~/lib/fetchers/category';
import { MainNavMenuRender } from '~/components/layouts/main-nav-menu-render';

export async function MainNavMenu() {
  const categories = await getCategories();
  const brands = await getBrands();

  return <MainNavMenuRender categories={categories} brands={brands} />;
}
