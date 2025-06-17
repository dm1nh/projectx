import { Trash2Icon } from "lucide-react"
import { NumericFormat } from "react-number-format"
import { useRevalidator } from "react-router"

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
import { Button } from "@/components/ui/button"
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
import type { ProductDoc, QuoteDoc } from "@/lib/db/schemas"
import { sortAndCalculateQuote } from "@/lib/utils"

import { ProductForm } from "./ProductForm"

export function QuoteProductTable({
  allowEdit = false,
  quote,
  products,
}: {
  allowEdit?: boolean
  quote: QuoteDoc
  products: ProductDoc[]
}) {
  const revalidator = useRevalidator()

  async function onDeleteProduct(id: string) {
    const db = await createDb()
    await db.products.findOne(id).remove()
    await db.quotes.findOne(quote.id).patch({
      products: quote.products?.filter((productId) => productId !== id),
    })
    revalidator.revalidate()
  }

  const data = sortAndCalculateQuote({ quote, products })

  return (
    products.length > 0 && (
      <div>
        <div className="space-y-8 rounded border p-4">
          {Object.values(data.productsByType).map((pbt) => (
            <div key={pbt.type}>
              <div className="flex items-center justify-between">
                <h3 className="ml-2 text-lg font-semibold uppercase">
                  {pbt.type}
                </h3>
                <NumericFormat
                  type="text"
                  className="text-right font-medium"
                  value={pbt.totalPriceIncludingVAT}
                  thousandSeparator=","
                  decimalScale={0}
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Tên</TableHead>
                    <TableHead className="w-[10%] text-right">
                      Đơn giá
                    </TableHead>
                    <TableHead className="w-[10%] text-right">
                      Số lượng
                    </TableHead>
                    <TableHead>Đơn vị</TableHead>
                    <TableHead className="w-[10%] text-right">VAT(%)</TableHead>
                    <TableHead className="w-[15%] text-right">
                      Thành tiền
                    </TableHead>
                    {allowEdit && (
                      <TableHead className="w-[15%] text-right">
                        Hành động
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pbt.products.map(({ doc, totalPriceIncludingVAT }) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>
                        <NumericFormat
                          type="text"
                          className="text-right"
                          value={doc.unitPrice}
                          thousandSeparator=","
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        {doc.quantity}
                      </TableCell>
                      <TableCell>{doc.unit}</TableCell>
                      <TableCell className="text-right">{doc.vat}</TableCell>
                      <TableCell className="text-right">
                        <NumericFormat
                          type="text"
                          className="text-right font-medium"
                          value={totalPriceIncludingVAT}
                          decimalScale={0}
                          thousandSeparator=","
                        />
                      </TableCell>
                      {allowEdit && (
                        <TableCell className="space-x-2 text-right">
                          <ProductForm quote={quote} product={doc} />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="icon">
                                <Trash2Icon />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Bạn có chắc muốn xóa sản phẩm này?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi
                                  phục.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDeleteProduct(doc.id)}
                                >
                                  Tiếp tục
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
          <div>
            <p>
              Tổng cộng (chưa bao gồm VAT):{" "}
              <NumericFormat
                type="text"
                className="text-destructive font-medium"
                value={data.totalPrice}
                decimalScale={0}
                thousandSeparator=","
              />
            </p>
            <p>
              VAT:{" "}
              <NumericFormat
                type="text"
                className="text-destructive font-medium"
                value={data.vat}
                decimalScale={0}
                thousandSeparator=","
              />
            </p>
            <p>
              Tổng cộng:{" "}
              <NumericFormat
                type="text"
                className="text-destructive font-medium"
                value={data.totalPriceIncludingVAT}
                decimalScale={0}
                thousandSeparator=","
              />
            </p>
          </div>
        </div>
      </div>
    )
  )
}
