'use client';

import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel';

export function Hero() {
  return (
    <Carousel plugins={[Autoplay()]}>
      <CarouselContent>
        <CarouselItem>
          <Image
            src='/images/hero1.jpg'
            alt='hero'
            width={1920}
            height={1280}
            className='h-auto max-h-[512px] w-screen border-b'
            loading='eager'
            priority
            sizes='100vw'
          />
        </CarouselItem>
        <CarouselItem>
          <Image
            src='/images/hero2.jpg'
            alt='hero'
            width={1920}
            height={1280}
            className='h-auto max-h-[512px] w-screen border-b'
            loading='eager'
            priority
            sizes='100vw'
          />
        </CarouselItem>
        <CarouselItem>
          <Image
            src='/images/hero3.jpg'
            alt='hero'
            width={1920}
            height={1280}
            className='h-auto max-h-[512px] w-screen border-b'
            sizes='100vw'
          />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className='left-4' />
      <CarouselNext className='right-4' />
    </Carousel>
  );
}
