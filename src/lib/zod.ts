import { z } from "zod"

export const createQuoteFormInputSchema = z.object({
  no: z.string().min(1, { message: "Quote number is required" }),
  customerName: z.string().min(1, { message: "Customer name is required" }),
  phoneNumber: z.string().min(10, { message: "Phone number is required" }),
  address: z.string(),
  taxCode: z.string(),
  carModel: z.string(),
  carRegistrationNumber: z.string(),
  carOdometer: z.coerce.number({ message: "Car odometer must be a number" }),
  carVin: z.string(),
  date: z
    .string()
    .datetime({ message: "Quote date must be in datetime format" }),
})

export type CreateQuoteFormInput = z.infer<typeof createQuoteFormInputSchema>

const typeEnum = ["1", "2", "3"] as const
const typeEnumSchema = z.enum(typeEnum)

export const createProductFormInputSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  unitPrice: z.coerce
    .number({ message: "Unit price must be a number" })
    .min(0)
    .default(0),
  unit: z.string().min(1, { message: "Unit is required" }),
  quantity: z.coerce
    .number({ message: "Quantity must be a number" })
    .min(1)
    .default(1),
  vat: z.coerce.number({ message: "VAT must be a number" }).min(0).default(0),
  type: typeEnumSchema.default("1"),
})

export type CreateProductFormInput = z.infer<
  typeof createProductFormInputSchema
>

export type TypeEnum = z.infer<typeof typeEnumSchema>
