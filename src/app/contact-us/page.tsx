import { type Metadata } from 'next';

import { PageHeader } from '~/components/page-header';

import { ContactInfo } from './_components/contact-info';
import { ContactUsForm } from './_components/contact-us-form';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with us',
};

export default function ContactUsPage() {
  return (
    <div className='container py-10'>
      <PageHeader title='Contact Us' description='Get in touch with us' />
      <div className='flex flex-col gap-10 lg:flex-row lg:items-start'>
        <ContactUsForm />
        <ContactInfo />
      </div>
    </div>
  );
}
