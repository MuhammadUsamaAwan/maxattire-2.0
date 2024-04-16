import { getBrandTitleDescription } from '~/lib/fetchers/brand';

type BrandHeaderProps = {
  slug: string;
};

export async function BrandHeader({ slug }: BrandHeaderProps) {
  const brand = await getBrandTitleDescription(slug);

  return (
    <div className='mb-6 space-y-1'>
      <h1 className='text-center text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]'>
        Browse {brand?.name} Collection
      </h1>
      <div
        className='prose mx-auto text-center dark:prose-invert'
        dangerouslySetInnerHTML={{
          __html: brand?.metaDescription ?? `Highest quality ${brand?.name}'s collection with free & fast shipping`,
        }}
      />
    </div>
  );
}
