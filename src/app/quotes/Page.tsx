import { PlusIcon } from "lucide-react"
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

import { QuoteCard } from "./Card"

export async function loader() {
  try {
    const db = await createDb()
    const data = await db.quotes.find().exec()
    return { error: null, data }
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message, data: null }
    }
  }
}

export function HydrateFallback() {
  return <div>Đang tải...</div>
}

export function QuotesPage() {
  const { error, data } = useLoaderData() as {
    error: string | null
    data: QuoteDoc[] | null
  }

  if (error || !data) {
    return <div>Lỗi</div>
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/projectx">Trang chủ</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Phiếu báo giá</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Link to="/projectx/quotes/form">
        <Button size="sm">
          <PlusIcon /> Thêm
        </Button>
      </Link>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {data?.map((quote) => <QuoteCard key={quote.id} quote={quote} />)}
      </div>
    </>
  )
}
