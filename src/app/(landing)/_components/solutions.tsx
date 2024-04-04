import Image from 'next/image';

import { Button } from '~/components/ui/button';

export function Solutions() {
  return (
    <section className='container grid gap-10 py-20 lg:grid-cols-2'>
      <div className='relative h-[350px]'>
        <Image src='/images/hero3.jpg' alt='Solutions' fill />
      </div>
      <div className='my-auto text-center'>
        <h2 className='mb-4 text-2xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]'>
          Max Attire Decorations
        </h2>
        <p className='mb-2'>
          Enhance your apparel with our exquisite Decoration services, adding intricate designs and personalized flair
          to your garments.
        </p>
        <div className='flex justify-center'>
          <Button size='lg'>Apparel & Decor</Button>
        </div>
      </div>
    </section>
  );
}
