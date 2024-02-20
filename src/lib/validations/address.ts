import { z } from 'zod';

export const addAddressSchema = z.object({
  phone: z.string().min(1),
  address: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
});
