import { z } from 'zod'

// Subdocument validation
const serviceInfoSchema = z.object({
  title: z.string({
    required_error: 'Service info title is required!',
  }),
  subTitle: z.string({
    required_error: 'Service info subtitle is required!',
  }),
})

// Create Validation
const createValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Service info title is required!',
    }),
    subTitle: z.string({
      required_error: 'Service info subtitle is required!',
    }),
    description: z.string({
      required_error: 'Service description is required!',
    }),
    images: z
      .array(z.string().url().or(z.string()))
      .nonempty({
        message: 'At least one image is required!',
      })
      .optional(),
    initialPrice: z.number({
      required_error: 'Service initial price is required!',
    }),
    finalPrice: z.number({
      required_error: 'Service final price is required!',
    }),
    info: z.array(serviceInfoSchema).nonempty({
      message: 'Service info list is required!',
    }),
  }),
})

// Update Validation (optional fields)
const updateValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    subTitle: z.string().optional(),
    description: z.string().optional(),
    initialPrice: z.number().optional(),
    finalPrice: z.number().optional(),
    images: z.array(z.string()).optional(),
    info: z.array(serviceInfoSchema).optional(),
  }),
})

export const ServiceValidation = {
  createValidationSchema,
  updateValidationSchema,
}
