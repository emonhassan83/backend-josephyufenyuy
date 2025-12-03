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
    user: objectIdSchema.optional(),
    name: z.string({
      required_error: 'Booking name is required',
    }),
    email: z.string({
      required_error: 'Booking email is required',
    }).email(),
    contactNumber: z.string({
      required_error: 'Booking contact number is required',
    }),
    notes: z.string().nullable().optional(),
  }),
})

// ✅ Update Validation Schema (everything optional)
const updateValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    contactNumber: z.string().optional(),
    notes: z.string().nullable().optional(),
  }),
})

export const ServiceBookingValidation = {
  createValidationSchema,
  updateValidationSchema,
}
