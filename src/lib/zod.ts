import { z } from "zod"

export const createQuoteFormInputSchema = z.object({
  customerName: z.string().min(1, { message: "Customer name is required" }),
  phoneNumber: z.string().min(10, { message: "Phone number is required" }),
  address: z.string(),
  taxCode: z.string(),
  carModel: z.string(),
  date: z
    .string()
    .datetime({ message: "Quote date must be in datetime format" }),
})

export type CreateQuoteFormInput = z.infer<typeof createQuoteFormInputSchema>

export const createProductFormInputSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  unit: z.string().min(1, { message: "Unit is required" }),
  quantity: z
    .number({ message: "Quantity must be a number" })
    .min(1)
    .default(1)
    .optional(),
  vat: z
    .number({ message: "VAT must be a number" })
    .min(0)
    .default(0)
    .optional(),
  type: z.enum(["1", "2", "3"]).default("1").optional(),
})

export type CreateProductFormInput = z.infer<
  typeof createProductFormInputSchema
>
