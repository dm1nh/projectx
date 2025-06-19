import { z } from "zod"

export const createQuoteFormInputSchema = z.object({
  no: z.string().min(1, { message: "Số phiếu là nội dung bắt buộc" }),
  customerName: z.string().min(1, { message: "Tên khách hàng là nội dung bắt buộc" }),
  phoneNumber: z.string().min(10, { message: "Số điện thoại là nội dung bắt buộc" }),
  address: z.string(),
  taxCode: z.string(),
  carModel: z.string(),
  carRegistrationNumber: z.string(),
  carOdometer: z.coerce.number({ message: "Số KM phải là một số dương" }),
  carVin: z.string(),
  date: z
    .string()
    .datetime({ message: "Ngày xuất phiếu chưa đúng định dạng" }),
})

export type CreateQuoteFormInput = z.infer<typeof createQuoteFormInputSchema>

const typeEnum = ["1", "2", "3"] as const
const typeEnumSchema = z.enum(typeEnum)

export const createProductFormInputSchema = z.object({
  name: z.string().min(1, { message: "Tên hạng mục là nội dung bắt buộc" }),
  unitPrice: z.coerce
    .number({ message: "Đơn giá phải ở dạng số" })
    .min(0)
    .default(0)
    .optional(),
  unit: z.string().min(1, { message: "Đơn vị tính là nội dung bắt buộc" }),
  quantity: z.coerce
    .number({ message: "Số lượng phải ở dạng số" })
    .min(1)
    .default(1)
    .optional(),
  vat: z.coerce
    .number({ message: "Thuế VAT phải ở dạng số" })
    .min(0)
    .default(8)
    .optional(),
  type: typeEnumSchema.default("1").optional(),
})

export type CreateProductFormInput = z.infer<
  typeof createProductFormInputSchema
>

export type TypeEnum = z.infer<typeof typeEnumSchema>
