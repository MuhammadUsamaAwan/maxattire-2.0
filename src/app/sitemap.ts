import { type MetadataRoute } from 'next';
import { and, eq, isNull } from 'drizzle-orm';

import { db } from '~/db';
import { categories, pages, posts, products, stores } from '~/db/schema';
import { absoluteUrl } from '~/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allCategories = await db.query.categories.findMany({
    where: and(isNull(categories.deletedAt), eq(categories.status, 'active')),
    columns: {
      slug: true,
    },
  });
  const allBrands = await db.query.stores.findMany({
    where: and(isNull(stores.deletedAt), eq(stores.status, 'active')),
    columns: {
      slug: true,
    },
  });
  const allProducts = await db.query.products.findMany({
    where: and(isNull(products.deletedAt), eq(products.status, 'active')),
    columns: {
      slug: true,
    },
  });
  const allPages = await db.query.pages.findMany({
    where: isNull(pages.deletedAt),
    columns: {
      slug: true,
    },
  });
  const allPosts = await db.query.posts.findMany({
    where: and(isNull(posts.deletedAt), eq(posts.status, 'active')),
    columns: {
      slug: true,
    },
  });
  const productRoutes = allProducts.map(product => ({
    url: absoluteUrl(`/products/${product.slug}`),
    lastModified: new Date().toISOString(),
  }));
  const categoryRoutes = allCategories.map(category => ({
    url: absoluteUrl(`/categories/${category.slug}`),
    lastModified: new Date().toISOString(),
  }));
  const brandRoutes = allBrands.map(brand => ({
    url: absoluteUrl(`/brands/${brand.slug}`),
    lastModified: new Date().toISOString(),
  }));
  const pageRoutes = allPages.map(page => ({
    url: absoluteUrl(`/${page.slug}`),
    lastModified: new Date().toISOString(),
  }));
  const postRoutes = allPosts.map(post => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date().toISOString(),
  }));
  const routes = ['', '/coupons-and-promotions', '/blog'].map(route => ({
    url: absoluteUrl(route),
    lastModified: new Date().toISOString(),
  }));
  return [...routes, ...productRoutes, ...categoryRoutes, ...brandRoutes, ...pageRoutes, ...postRoutes];
}
