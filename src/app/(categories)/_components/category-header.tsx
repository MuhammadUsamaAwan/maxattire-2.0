import { getCategoryTitleDescription } from '~/lib/fetchers/category';

type CategoryHeaderProps = {
  slug: string;
};

export async function CategoryHeader({ slug }: CategoryHeaderProps) {
  const category = await getCategoryTitleDescription(slug);

  return (
    <div className='mb-6 space-y-1'>
      <h1 className='text-center text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]'>
        Browse {category?.title} Collection
      </h1>
      <div
        className='prose mx-auto text-center dark:prose-invert'
        dangerouslySetInnerHTML={{
          __html: category?.description ?? `Highest quality ${category?.title}'s collection with free & fast shipping`,
        }}
      />
    </div>
  );
}
