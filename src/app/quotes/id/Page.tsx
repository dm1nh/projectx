import { format } from "date-fns"
import { EditIcon, PrinterIcon, Trash2Icon } from "lucide-react"
import { Link, useLoaderData, useNavigate, useRevalidator } from "react-router"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { createDb } from "@/lib/db"
import { ProductDoc, type QuoteDoc } from "@/lib/db/schemas"

import { QuoteProductTable } from "../form/ProductTable"

export async function loader({ params }: { params: { id: string } }) {
  try {
    const db = await createDb()
    const quote = await db.quotes.findOne(params.id).exec()
    if (!quote) return { error: "Not found", data: null }
    const products = await quote.populate("products")
    return { error: null, data: { quote, products } }
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
  const revalidator = useRevalidator()
  const navigate = useNavigate()
  const { error, data } = useLoaderData() as {
    error: string | null
    data: { quote: QuoteDoc; products: ProductDoc[] } | null
  }

  if (error || !data) {
    return <div>Error</div>
  }

  async function onDeleteQuote() {
    const db = await createDb()
    await db.quotes.findOne(data?.quote.id).remove()
    revalidator.revalidate()
    navigate("/projectx/quotes")
  }

  const { quote } = data

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
              <BreadcrumbPage>{quote.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="space-x-2">
        <Link to={`/projectx/quotes/${quote.id}/print`}>
          <Button size="sm">
            <PrinterIcon /> In
          </Button>
        </Link>

        <Link to={`/projectx/quotes/form?id=${quote.id}`}>
          <Button size="sm" variant="outline">
            <EditIcon /> Sửa
          </Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2Icon /> Xóa
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Bạn có chắc muốn xóa phiếu báo giá này?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi phục.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteQuote}>
                Tiếp tục
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div>
        <p>Số: {quote.no}</p>
        <p>Khách hàng: {quote.customerName}</p>
        <p>Điện thoại: {quote.phoneNumber}</p>
        <p>Địa chỉ: {quote.address ?? "N/A"}</p>
        <p>Mã số thuế: {quote.taxCode ?? "N/A"}</p>
        <p>Mẫu xe: {quote.carModel ?? "N/A"}</p>
        <p>Biển số: {quote.carRegistrationNumber ?? "N/A"}</p>
        <p>Số km: {quote.carOdometer ?? "N/A"}</p>
        <p>VIN: {quote.carVin ?? "N/A"}</p>
        <p>Ngày: {format(quote.date, "dd-MM-yyy")}</p>
        <p>Ngày tạo: {format(quote.createdAt, "dd-MM-yyy")}</p>
      </div>
      <Separator />
      <QuoteProductTable {...data} />
    </>
  )
}
