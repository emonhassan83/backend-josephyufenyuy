import { z } from 'zod'
import { USER_STATUS } from './user.constant'

// Define the Zod validation schema
const createValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'User name is required!',
    }),
    email: z.string({
      required_error: 'Email is required!',
    }),
    password: z
      .string({
        invalid_type_error: 'Password must be a string',
      })
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(20, { message: 'Password cannot be more than 20 characters' })
  }),
})

const updateValidationSchema = z.object({
  name: z
    .string({
      required_error: 'User name is required!',
    })
    .optional(),
  contactNumber: z
    .string({
      required_error: 'Contract number is required!',
    })
    .min(6, { message: 'Contact number must be at least 6 digits long' })
    .max(15, { message: 'Contact number must be at most 15 digits long' })
    .optional(),
})

const changeStatusValidationSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: 'User id is required!',
    }),
    status: z.enum(Object.values(USER_STATUS) as [string, ...string[]], {
      required_error: 'User status is required!',
    }),
  }),
})

export const UserValidation = {
  createValidationSchema,
  updateValidationSchema,
  changeStatusValidationSchema
}
