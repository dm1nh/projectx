import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, PlusIcon } from "lucide-react"
import { nanoid } from "nanoid"
import { useForm } from "react-hook-form"
import { Link, LoaderFunction, useLoaderData, useNavigate } from "react-router"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { createDb } from "@/lib/db"
import { QuoteDoc } from "@/lib/db/schemas"
import { cn } from "@/lib/utils"
import {
  createQuoteFormInputSchema,
  type CreateQuoteFormInput,
} from "@/lib/zod"

import { ProductForm } from "./ProductForm"

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")
    if (!id) return { error: "No quote id provided", data: null }
    const db = await createDb()
    const result = await db.quotes
      .find({
        selector: {
          id: {
            $eq: id,
          },
        },
      })
      .exec()
    if (!result[0]) return { error: "Not found", data: null }
    return { error: null, data: result[0] }
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message, data: null }
    }
  }
}

export function HydrateFallback() {
  return <div>Loading...</div>
}

export function QuoteFormPage() {
  const navigate = useNavigate()
  const { error, data } = useLoaderData() as {
    error: string | null
    data: QuoteDoc | null
  }

  const form = useForm<CreateQuoteFormInput>({
    resolver: zodResolver(createQuoteFormInputSchema),
    defaultValues: {
      customerName: data?.customerName ?? "",
      phoneNumber: data?.phoneNumber ?? "",
      address: data?.address ?? "",
      taxCode: data?.taxCode ?? "",
      carModel: data?.carModel ?? "",
      date: new Date().toISOString(),
    },
  })

  if (error || !data) {
    return <div>Error</div>
  }

  async function onSubmit(values: CreateQuoteFormInput) {
    const db = await createDb()
    await db.quotes.insert({
      id: nanoid(),
      ...values,
      createdAt: new Date().toISOString(),
    })
    navigate("/quotes")
  }

  return (
    <>
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/quotes">Quotes</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {data ? `Edit #${data.id}` : "Create"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-[360px] space-y-4"
          >
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name*</FormLabel>
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
                  <FormLabel>Phone*</FormLabel>
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
                  <FormLabel>Address</FormLabel>
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
                  <FormLabel>Tax Code</FormLabel>
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
                  <FormLabel>Car Model</FormLabel>
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
                  <FormLabel>Date</FormLabel>
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
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("2024-01-01")}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{data ? "Update" : "Save"}</Button>
          </form>
        </Form>
      </div>
      {data && (
        <div>
          <Dialog>
            <DialogTrigger>
              <Button variant="secondary">
                <PlusIcon /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription>
                Add new product to Quote #{data.id}
              </DialogDescription>
              <ProductForm />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  )
}
