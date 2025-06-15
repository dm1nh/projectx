import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "lucide-react"
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
      name: "",
      unitPrice: 0,
      unit: "",
      quantity: 1,
      vat: 0,
      type: "1",
    },
  })

  async function onSubmit(values: CreateProductFormInput) {
    const db = await createDb()
    if (!product) {
      const newProduct = await db.products.insert({
        id: nanoid(),
        ...values,
      })
      console.log(newProduct)
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
      form.reset()
      setOpen(false)
      revalidator.revalidate()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <PlusIcon /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add Product</DialogTitle>
        <DialogDescription>
          Add new product to Quote #{quote.id}
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
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
                  <FormLabel>Unit Price</FormLabel>
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
                  <FormLabel>Unit</FormLabel>
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
                  <FormLabel>Quantity</FormLabel>
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
                  <FormLabel>VAT</FormLabel>
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
                  <FormLabel>Type</FormLabel>
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
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
