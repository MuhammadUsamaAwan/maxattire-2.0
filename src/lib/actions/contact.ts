'use server';

import { type z } from 'zod';

import { contactSchema } from '../validations/contact';

export async function contactUs(rawInput: z.infer<typeof contactSchema>) {
  const { name, email, subject, message } = contactSchema.parse(rawInput);
  // add 2 seconds delay to simulate server response
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log({ name, email, subject, message });
  return;
}
