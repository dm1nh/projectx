import { Link, LoaderFunction, useLoaderData } from "react-router"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { createDb } from "@/lib/db"
import { ProductDoc, QuoteDoc } from "@/lib/db/schemas"

import { QuoteForm } from "./Form"
import { ProductForm } from "./ProductForm"
import { QuoteProductTable } from "./ProductTable"

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")
    if (!id) return { error: "No quote id provided", data: null }
    const db = await createDb()
    const data = await db.quotes.findOne(id).exec()
    if (!data) return { error: "Not found", data: null }
    const products = await data.populate("products")
    return { error: null, data: { quote: data, products } }
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message, data: null }
    }
  }
}

export function HydrateFallback() {
  return <div>Đang tải...</div>
}

export function QuoteFormPage() {
  const { data } = useLoaderData() as {
    error: string | null
    data: { quote: QuoteDoc; products: ProductDoc[] } | null
  }

  return (
    <>
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/projectx">Trang chủ</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/projectx/quotes">Phiếu báo giá</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {data ? `Sửa #${data.quote.id}` : "Tạo mới"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-y-4">
        <QuoteForm quote={data?.quote} />
        <Separator />
        {data && (
          <>
            <ProductForm quote={data.quote} />
            <QuoteProductTable {...data} allowEdit />
          </>
        )}
      </div>
    </>
  )
}
