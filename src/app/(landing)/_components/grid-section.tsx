import Image from 'next/image';

import { Button } from '~/components/ui/button';

export function GridSection() {
  return (
    <section className='bg-accent'>
      <div className='container grid gap-10 py-20 lg:grid-cols-2 lg:gap-0'>
        <div className='relative order-1 h-[400px] lg:order-1'>
          <Image src='/images/hero1.jpg' alt='hero' fill />
        </div>
        <div className='order-2 my-auto text-center lg:order-2 lg:px-8'>
          <h2 className='mb-2 text-2xl font-bold leading-tight tracking-tighter lg:leading-[1.1]'>
            Need Help? Our team are ready to assist you.
          </h2>
          <p className='mb-4'>
            Get in touch with us via phone, email, or chat and we can answer any question you throw at us!
          </p>
          <Button>Learn More</Button>
        </div>
        <div className='order-4 my-auto text-center lg:order-3 lg:px-8'>
          <h2 className='mb-2 text-2xl font-bold leading-tight tracking-tighter lg:leading-[1.1]'>
            You can always expect
          </h2>
          <p className='mb-4'>
            Brands you love, expertly decorated with your logo or custom design. Unrivaled customer service. A seamless
            purchasing process that gets your order to you faster than anyone in the industry. Pure brand awesomeness,
            delivered straight to your door.
          </p>
          <Button>Learn More</Button>
        </div>
        <div className='relative order-3 h-[400px] lg:order-4'>
          <Image src='/images/hero2.jpg' alt='hero' fill />
        </div>
      </div>
    </section>
  );
}
