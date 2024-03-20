import * as React from 'react';
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

export type OrderEmailProps = {
  code: string;
  grandTotal: number;
  orderProducts: {
    price: number;
    quantity: number;
    product: {
      title: string;
      slug: string;
      thumbnail: string;
    };
    productStock: {
      size: {
        title: string;
      };
      color: {
        title: string;
      };
    };
  }[];
  address: {
    state: string | null;
    city: string | null;
    address: string | null;
    phone: string | null;
    postalCode: string | null;
  };
};

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';

export const OrderEmail = ({ code, grandTotal, orderProducts, address }: OrderEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Thank you for your order</Preview>
      <Tailwind>
        <Body className='m-auto bg-white px-2 font-sans'>
          <Container className='mx-auto my-[40px] max-w-xl rounded border border-solid border-[#eaeaea] p-[20px]'>
            <Heading className='mx-0 p-0 text-center text-[24px] font-normal text-black'>
              <strong>Thank you for your order</strong>
            </Heading>
            <Text className='text-[14px] leading-[24px] text-[#666666]'>
              Your Order #{code} has been placed! Hope you liked our service. We would love to hear your feedback.
            </Text>
            <Hr />
            <Section>
              {orderProducts.map(({ price, quantity, product, productStock }) => (
                <>
                  <Row>
                    <Column className='w-[64px]'>
                      <Link href={`${baseUrl}/products/${product?.slug}`}>
                        <Img
                          src={product?.thumbnail ?? ''}
                          alt={product?.title ?? ''}
                          className='rounded object-cover'
                          width='64'
                          height='64'
                        />
                      </Link>
                    </Column>
                    <Column className='pl-[16px] text-[12px]'>
                      <Text className='my-[4px]'>
                        <strong>{product?.title}</strong>
                      </Text>
                      <Text className='my-[4px] text-[#666666]'>Qty {quantity}</Text>
                      <Text className='my-[4px] text-[#666666]'>
                        {productStock?.color?.title} - {productStock?.size?.title}
                      </Text>
                    </Column>
                    <Column align='right'>
                      <Text className='text-[12px]'>
                        <strong>${(price ?? 0) * (quantity ?? 0)}</strong>
                      </Text>
                    </Column>
                  </Row>
                  <Hr />
                </>
              ))}
              <Row>
                <Column>
                  <strong>Total</strong>
                </Column>
                <Column align='right'>
                  <Text>
                    <strong>${grandTotal}</strong>
                  </Text>
                </Column>
              </Row>
            </Section>
            <Hr />
            <Section>
              <Text className='mb-[4px]'>
                <strong>Shipping Address:</strong>
              </Text>
              <Text className='mt-[4px] text-[#666666]'>
                {address.address}, {address.city}, {address.state}, {address.postalCode}
              </Text>
            </Section>
            <Hr />
            <Section>
              <Text className='text-[#666666]'>You can view your order details by clicking the button below</Text>
              <Button
                className='mb-[16px] rounded bg-[#e1232d] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline'
                href={`${baseUrl}/dashboard/orders/${code}`}
              >
                View Order
              </Button>
            </Section>
            <Hr />
            <Section>
              <Text className='mb-[6px] text-center text-[12px] text-[#888888]'>
                © 2024 MaxAttire. All Rights Reserved.
              </Text>
              <Row>
                <Column align='center'>
                  <Link href={`${baseUrl}/contact-us`} className='text-[12px] text-[#888888]'>
                    Contact Us
                  </Link>
                </Column>
                <Column align='center'>
                  <Link href={`${baseUrl}/about-us`} className='text-[12px] text-[#888888]'>
                    About Us
                  </Link>
                </Column>
                <Column align='center'>
                  <Link href={`${baseUrl}/privacy-policy`} className='text-[12px] text-[#888888]'>
                    Privacy Policy
                  </Link>
                </Column>
                <Column align='center'>
                  <Link href={`${baseUrl}/terms-condition`} className='text-[12px] text-[#888888]'>
                    Terms & Conditions
                  </Link>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

OrderEmail.PreviewProps = {
  code: '123',
  grandTotal: 246,
  orderProducts: [
    {
      price: 123,
      quantity: 2,
      product: {
        title: "Men's Black Shirt",
        slug: 'slug',
        thumbnail:
          'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      productStock: {
        size: {
          title: 'XS',
        },
        color: {
          title: 'Black',
        },
      },
    },
  ],
  address: {
    id: 1,
    state: 'California',
    city: 'Los Angeles',
    address: '123 Main St',
    phone: '123-456-7890',
    postalCode: '90001',
  },
} as OrderEmailProps;

export default OrderEmail;
