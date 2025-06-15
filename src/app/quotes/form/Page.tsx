import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { nanoid } from "nanoid"
import { useForm } from "react-hook-form"
import { NumericFormat } from "react-number-format"
import {
  Link,
  LoaderFunction,
  useLoaderData,
  useNavigate,
  useRevalidator,
} from "react-router"

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
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { mappedProductType } from "@/lib/constants"
import { createDb } from "@/lib/db"
import { ProductDoc, QuoteDoc } from "@/lib/db/schemas"
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
    const data = await db.quotes.findOne(id).exec()
    if (!data) return { error: "Not found", data: null }
    const products = await data.populate("products")
    console.log(data, products)
    return { error: null, data: { quote: data, products } }
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
  const revalidator = useRevalidator()
  const navigate = useNavigate()
  const { error, data } = useLoaderData() as {
    error: string | null
    data: { quote: QuoteDoc; products: ProductDoc[] } | null
  }

  const form = useForm<CreateQuoteFormInput>({
    resolver: zodResolver(createQuoteFormInputSchema),
    defaultValues: {
      no: data?.quote.no ?? "",
      customerName: data?.quote.customerName ?? "",
      phoneNumber: data?.quote.phoneNumber ?? "",
      address: data?.quote.address ?? "",
      taxCode: data?.quote.taxCode ?? "",
      carModel: data?.quote.carModel ?? "",
      carRegistrationNumber: data?.quote.carModel ?? "",
      carOdometer: data?.quote.carOdometer ?? 0,
      carVin: data?.quote.carVin ?? "",
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
    revalidator.revalidate()
    navigate("/quotes")
  }

  const products = data.products
    .sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1))
    .reduce(
      (obj, curr) => {
        if (!obj[curr.type]) {
          obj[curr.type] = [curr]
          return obj
        }

        obj[curr.type] = [...obj[curr.type], curr]
        return obj
      },
      {} as { [prop: string]: ProductDoc[] },
    )

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
                {data ? `Edit #${data.quote.id}` : "Create"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-y-4">
        <div>
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
                    <FormLabel>No*</FormLabel>
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
                name="carRegistrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Car Registration Number</FormLabel>
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
                    <FormLabel>Car Odometer</FormLabel>
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
                    <FormLabel>Car VIN</FormLabel>
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
              <Button type="submit" className="justify-self-start">
                {data ? "Update Quote" : "Save"}
              </Button>
            </form>
          </Form>
        </div>
        <Separator />
        <ProductForm quote={data.quote} />
        {data.products.length > 0 && (
          <div className="space-y-4">
            <div className="rounded border p-4">
              {Object.keys(products).map((type) => (
                <div key={type} className="space-y-2">
                  <h3 className="ml-4 text-lg font-semibold uppercase">
                    {mappedProductType[type as "1" | "2" | "3"]}
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Name</TableHead>
                        <TableHead className="w-[100px] text-right">
                          Unit Price
                        </TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead className="text-right">VAT(%)</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products[type].map((product) => (
                        <TableRow>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>
                            <NumericFormat
                              type="text"
                              className="text-right"
                              value={product.unitPrice}
                              thousandSeparator=","
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            {product.quantity}
                          </TableCell>
                          <TableCell>{product.unit}</TableCell>
                          <TableCell className="text-right">
                            {product.vat}
                          </TableCell>
                          <TableCell className="text-right">
                            <NumericFormat
                              type="text"
                              className="text-right"
                              value={
                                product.unitPrice *
                                product.quantity *
                                ((100 + product.vat) / 100)
                              }
                              decimalScale={0}
                              thousandSeparator=","
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
