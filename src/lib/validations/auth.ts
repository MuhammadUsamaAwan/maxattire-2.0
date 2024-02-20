import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters long',
    })
    .max(100),
});

export const signUpSchema = z
  .object({
    email: signInSchema.shape.email,
    password: signInSchema.shape.password,
    confirmPassword: signInSchema.shape.password,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
