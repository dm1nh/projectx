import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { PenIcon, PlusIcon } from "lucide-react"
import { nanoid } from "nanoid"
import { useForm } from "react-hook-form"
import { useRevalidator } from "react-router"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mappedProductType } from "@/lib/constants"
import { createDb } from "@/lib/db"
import type { ProductDoc, QuoteDoc } from "@/lib/db/schemas"
import {
  createProductFormInputSchema,
  type CreateProductFormInput,
} from "@/lib/zod"

export function ProductForm({
  quote,
  product,
}: {
  quote: QuoteDoc
  product?: ProductDoc
}) {
  const revalidator = useRevalidator()
  const [open, setOpen] = useState(false)
  const form = useForm<CreateProductFormInput>({
    resolver: zodResolver(createProductFormInputSchema),
    defaultValues: {
      name: product?.name ?? "",
      unitPrice: product?.unitPrice ?? 0,
      unit: product?.unit ?? "",
      quantity: product?.quantity ?? 1,
      vat: product?.vat ?? 0,
      type: product?.type ?? "1",
    },
  })

  async function onSubmit(values: CreateProductFormInput) {
    const db = await createDb()
    if (!product) {
      const newProduct = await db.products.insert({
        id: nanoid(),
        name: values.name,
        unitPrice: values.unitPrice ?? 0,
        quantity: values.quantity ?? 1,
        unit: values.unit,
        vat: values.vat ?? 8,
        type: values.type ?? "1",
      })
      await db.quotes
        .find({
          selector: {
            id: { $eq: quote.id },
          },
        })
        .patch({
          products: quote.products
            ? [...quote.products, newProduct.id]
            : [newProduct.id],
        })
    } else {
      await db.products.findOne(product.id).patch(values)
    }
    form.reset()
    setOpen(false)
    revalidator.revalidate()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {product ? (
          <Button variant="outline" size="icon">
            <PenIcon />
          </Button>
        ) : (
          <Button variant="secondary">
            <PlusIcon /> Thêm sản phẩm
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{product ? `Sửa sản phẩm` : "Thêm sản phẩm"}</DialogTitle>
        <DialogDescription>
          {product
            ? `Sửa sản phẩm #${product.id} trong phiếu #${quote.id}`
            : `Thêm sản phẩm mới vào phiếu #${quote.id}`}
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên sản phẩm</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đơn giá</FormLabel>
                  <FormControl>
                    <NumberInput min={0} stepper={1000} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đơn vị tính</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng</FormLabel>
                  <FormControl>
                    <NumberInput min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VAT(%)</FormLabel>
                  <FormControl>
                    <NumberInput min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại sản phẩm</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(mappedProductType).map((type) => (
                        <SelectItem value={type}>
                          {
                            mappedProductType[
                              type as keyof typeof mappedProductType
                            ]
                          }
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{product ? "Cập nhật" : "Thêm"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
