import { z } from 'zod'
import { Types } from 'mongoose'

// Validate MongoDB ObjectId
const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId format!',
})

// ✅ Create Validation Schema (strictly based on model)
const createValidationSchema = z.object({
  body: z.object({
    service: objectIdSchema,
    user: objectIdSchema,
    notes: z.string().nullable().optional(),
  }),
})

// ✅ Update Validation Schema (everything optional)
const updateValidationSchema = z.object({
  body: z.object({
    notes: z.string().nullable().optional(),
  }),
})

export const ServiceBookingValidation = {
  createValidationSchema,
  updateValidationSchema,
}
