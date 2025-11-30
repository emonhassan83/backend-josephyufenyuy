import { z } from 'zod';

// Reusable string with default
const optionalString = z.string().default('');

const createValidationSchema = z.object({
  body: z.object({
    termsAndConditions: optionalString,
    privacyPolicy: optionalString,
    aboutUs: optionalString,
  }),
});

const updateValidationSchema = createValidationSchema;

export const ContentsValidation = {
  createValidationSchema,
  updateValidationSchema,
};
