import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(3).max(60),
  email: z.string().email(),
  subject: z.string().min(3).max(60),
  message: z.string().min(10).max(1000),
});
