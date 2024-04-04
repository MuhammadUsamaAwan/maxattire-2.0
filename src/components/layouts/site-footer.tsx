import Image from 'next/image';
import Link from 'next/link';

import { siteConfig } from '~/config/site';
import { Icons } from '~/components/icons';

export function SiteFooter() {
  const footerLinks = [
    {
      title: 'Our Company',
      items: [
        {
          title: 'Apparel',
          href: '/apparel',
        },
        {
          title: 'Coupons & Promotions',
          href: '/coupons-and-promotions',
        },
        {
          title: 'Contact Us',
          href: '/contact-us',
        },
        {
          title: 'About Us',
          href: '/about-us',
        },
      ],
    },
    {
      title: 'Policies',
      items: [
        {
          title: 'Terms & Conditions',
          href: '/terms-and-conditions',
        },
        {
          title: 'Returns',
          href: '/returns',
        },
        {
          title: 'Shipping & Payment',
          href: '/shipping-and-payment',
        },
      ],
    },
  ];

  return (
    <footer className='w-full border-t bg-background'>
      <div className='container py-10'>
        <section
          id='footer-content'
          aria-labelledby='footer-content-heading'
          className='flex flex-col gap-10 lg:flex-row lg:gap-20'
        >
          <section id='footer-branding' aria-labelledby='footer-branding-heading'>
            <Link href='/'>
              <Image src='/images/logo.jpeg' alt={siteConfig.title} width={117} height={20} sizes='117px' />
            </Link>
          </section>
          <section
            id='footer-links'
            aria-labelledby='footer-links-heading'
            className='grid flex-1 grid-cols-1 gap-10 xxs:grid-cols-2 sm:grid-cols-3'
          >
            {footerLinks.map(item => (
              <div key={item.title} className='space-y-1.5'>
                <h4 className='text-base font-medium'>{item.title}</h4>
                <ul className='space-y-1'>
                  {item.items.map(link => (
                    <li key={link.title}>
                      <Link href={link.href} className='text-sm hover:text-primary'>
                        {link.title}
                        <span className='sr-only'>{link.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className='space-y-1.5'>
              <h4 className='text-base font-medium'>Let&apos;s Talk</h4>
              <ul className='space-y-1'>
                <li>
                  <a href='tel:(000) 000-0000' className='text-sm hover:text-primary'>
                    (000) 000-0000
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${siteConfig.title.toLowerCase()}@support.com`}
                    className='text-sm hover:text-primary'
                  >
                    {`${siteConfig.title.toLowerCase()}@support.com`}
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </section>
        <section
          id='footer-bottom'
          aria-labelledby='footer-bottom-heading'
          className='mt-6 flex flex-col items-center justify-between gap-6 sm:flex-row'
        >
          <div className='flex items-center space-x-4'>
            <a href='https://facebook.com' rel='noreferrer' target='_blank' aria-label='facebook'>
              <Icons.facebook className='size-5' />
            </a>
            <a href='https://instagram.com' rel='noreferrer' target='_blank' aria-label='instagram'>
              <Icons.instagram className='size-5' />
            </a>
            <a href='https://twitter.com' rel='noreferrer' target='_blank' aria-label='twitter'>
              <Icons.twitter className='size-5' />
            </a>
            <a href='https://linkedin.com' rel='noreferrer' target='_blank' aria-label='linkedin'>
              <Icons.linkedin className='size-5' />
            </a>
          </div>
          <p className='text-center text-sm sm:text-left'>
            &copy; {new Date().getFullYear()} {siteConfig.title}. All Rights Reserved.
          </p>
        </section>
      </div>
    </footer>
  );
}
