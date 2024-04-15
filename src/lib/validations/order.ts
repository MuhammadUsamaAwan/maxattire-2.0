import { z } from 'zod';

export const confirmOrderSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  shippingAddress: z.string().min(1, {
    message: 'Shipping address is required',
  }),
  billingAddress: z.string().min(1, {
    message: 'Billing address is required',
  }),
});

export const createOrderSchema = z.object({
  shippingAddressId: z.number().min(1),
  billingAddressId: z.number().min(1),
});
