import { format } from "date-fns"
import { EditIcon } from "lucide-react"
import { Link, useLoaderData } from "react-router"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { createDb } from "@/lib/db"
import { type QuoteDoc } from "@/lib/db/schemas"

export async function loader({ params }: { params: { id: string } }) {
  try {
    const db = await createDb()
    const result = await db.quotes
      .find({
        selector: {
          id: { $eq: params.id },
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

export function QuotePage() {
  const { error, data } = useLoaderData() as {
    error: string | null
    data: QuoteDoc | null
  }

  if (error || !data) {
    return <div>Error</div>
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
              <BreadcrumbPage>{data.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Link to={`/quotes/form?id=${data.id}`}>
        <Button size="sm">
          <EditIcon /> Edit
        </Button>
      </Link>
      <div>
        <p>Customer Name: {data.customerName}</p>
        <p>Phone: {data.phoneNumber}</p>
        <p>Address: {data.address ?? "N/A"}</p>
        <p>Tax Code: {data.taxCode ?? "N/A"}</p>
        <p>Car Model: {data.carModel ?? "N/A"}</p>
        <p>Date: {format(data.date, "dd-MM-yyy")}</p>
        <p>Created At: {format(data.createdAt, "dd-MM-yyy")}</p>
      </div>
    </>
  )
}
