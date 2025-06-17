import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, LoaderCircleIcon } from "lucide-react"
import { nanoid } from "nanoid"
import { useForm } from "react-hook-form"
import { useNavigate, useRevalidator } from "react-router"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { createDb } from "@/lib/db"
import type { QuoteDoc } from "@/lib/db/schemas"
import { cn } from "@/lib/utils"
import {
  createQuoteFormInputSchema,
  type CreateQuoteFormInput,
} from "@/lib/zod"

export function QuoteForm({ quote }: { quote?: QuoteDoc }) {
  const revalidator = useRevalidator()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const form = useForm<CreateQuoteFormInput>({
    resolver: zodResolver(createQuoteFormInputSchema),
    defaultValues: {
      no: quote?.no ?? "",
      customerName: quote?.customerName ?? "",
      phoneNumber: quote?.phoneNumber ?? "",
      address: quote?.address ?? "",
      taxCode: quote?.taxCode ?? "",
      carModel: quote?.carModel ?? "",
      carRegistrationNumber: quote?.carModel ?? "",
      carOdometer: quote?.carOdometer ?? 0,
      carVin: quote?.carVin ?? "",
      date: new Date().toISOString(),
    },
  })

  async function onSubmit(values: CreateQuoteFormInput) {
    setLoading(true)
    const db = await createDb()

    if (!quote) {
      await db.quotes.insert({
        id: nanoid(),
        ...values,
        createdAt: new Date().toISOString(),
      })
      revalidator.revalidate()
      setLoading(false)
      navigate("/projectx/quotes")
      return
    }

    await db.quotes.findOne(quote.id).patch(values)
    setLoading(false)
    revalidator.revalidate()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
        <FormField
          control={form.control}
          name="no"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khách hàng*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Điện thoại*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="taxCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã số thuế</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="carModel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mẫu xe</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="carRegistrationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biển số xe</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="carOdometer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số km</FormLabel>
              <FormControl>
                <NumberInput min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="carVin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VIN</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ngày</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd-MM-yyy")
                      ) : (
                        <span>Chọn một ngày</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(field.value)}
                    onSelect={(value) => field.onChange(value?.toISOString())}
                    disabled={(date) => date < new Date("2024-01-01")}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="justify-self-start" disabled={loading}>
          {loading ? (
            <>
              <LoaderCircleIcon className="animate-spin" /> Đang xử lý
            </>
          ) : quote ? (
            "Cập nhật"
          ) : (
            "Tạo mới"
          )}
        </Button>
      </form>
    </Form>
  )
}
