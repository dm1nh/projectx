import { Link } from "react-router"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

export function HydrateFallback() {
  return <div>Loading...</div>
}

export function HomePage() {
  return (
    <>
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Trang chủ</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div>
        <Link to="/quotes">
          <div className="rounded-lg border p-4">
            <h3 className="text-2xl font-semibold">Phiếu báo giá</h3>
          </div>
        </Link>
      </div>
    </>
  )
}
