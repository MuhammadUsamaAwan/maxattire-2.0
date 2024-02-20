import { z } from 'zod';

export const addAddressSchema = z.object({
  phone: z.string().min(1, {
    message: 'Phone is required',
  }),
  address: z.string().min(1, {
    message: 'Address is required',
  }),
  state: z.string().min(1, {
    message: 'State is required',
  }),
  city: z.string().min(1, {
    message: 'City is required',
  }),
  postalCode: z.string(),
});
