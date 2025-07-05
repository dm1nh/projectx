import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { mappedProductType } from "./constants"
import type { ProductDoc, QuoteDoc } from "./db/schemas"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sortAndCalculateQuote(data: {
  quote: QuoteDoc
  products: ProductDoc[]
}) {
  const productsByType = data.products.reduce(
    (obj, curr) => {
      const productTotalPrice = curr.quantity * curr.unitPrice
      const productVAT = productTotalPrice * (curr.vat / 100)
      const productTotalPriceIncludingVAT =
        productTotalPrice * ((100 + curr.vat) / 100)

      if (!obj[curr.type]) {
        obj[curr.type] = {
          type: mappedProductType[curr.type],
          products: [
            {
              doc: curr,
              totalPrice: productTotalPrice,
              vat: productVAT,
              totalPriceIncludingVAT: productTotalPriceIncludingVAT,
            },
          ],
          totalPrice: productTotalPrice,
          vat: productVAT,
          totalPriceIncludingVAT: productTotalPriceIncludingVAT,
        }
        return obj
      }

      obj[curr.type].products = [
        ...obj[curr.type].products,
        {
          doc: curr,
          totalPrice: productTotalPrice,
          vat: productVAT,
          totalPriceIncludingVAT: productTotalPriceIncludingVAT,
        },
      ]
      obj[curr.type].totalPrice += productTotalPrice
      obj[curr.type].vat += productVAT
      obj[curr.type].totalPriceIncludingVAT += productTotalPriceIncludingVAT
      return obj
    },
    {} as {
      [prop: string]: {
        type: string
        products: {
          doc: ProductDoc
          totalPrice: number
          vat: number
          totalPriceIncludingVAT: number
        }[]
        totalPrice: number
        vat: number
        totalPriceIncludingVAT: number
      }
    },
  )
  return {
    ...data,
    productsByType,
    totalPrice: Object.values(productsByType).reduce(
      (acc, curr) => acc + curr.totalPrice,
      0,
    ),
    vat: Object.values(productsByType).reduce((acc, curr) => acc + curr.vat, 0),
    totalPriceIncludingVAT: Object.values(productsByType).reduce(
      (acc, curr) => acc + curr.totalPriceIncludingVAT,
      0,
    ),
  }
}
