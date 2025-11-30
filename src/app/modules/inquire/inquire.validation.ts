import { z } from 'zod'

const sentEmailSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Inquire name is required' }),
    email: z.string({ required_error: 'Inquire email is required' }),
    subject: z.string({ required_error: 'Inquire subject is required' }),
    message: z.string({ required_error: 'Inquire message is required' }),
  }),
})

export const InquireValidations = {
  sentEmailSchema,
}
