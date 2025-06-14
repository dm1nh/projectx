import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxCollection,
  type RxDocument,
  type RxJsonSchema,
} from "rxdb/plugins/core"

export const quoteSchemaLiteral = {
  title: "quote schema",
  description: "includes quote info",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    customerName: {
      type: "string",
    },
    phoneNumber: {
      type: "string",
    },
    address: { type: "string" },
    taxCode: { type: "string" },
    carModel: { type: "string" },
    date: { type: "string", format: "date-time" },
    products: {
      type: "array",
      ref: "quotes",
      items: { type: "string" },
    },
    createdAt: { type: "string", format: "date-time" },
  },
  required: ["id", "customerName", "phoneNumber", "date", "createdAt"],
} as const

export const quoteSchemaTyped = toTypedRxJsonSchema(quoteSchemaLiteral)

export type QuoteDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof quoteSchemaTyped
>

export type QuoteDocMethods = {
  getTotalPrice: () => Promise<number>
}

export type QuoteCollectionMethods = {
  countAll: () => Promise<number>
}

export type QuoteDoc = RxDocument<QuoteDocType>

export type QuoteCollection = RxCollection<
  QuoteDocType,
  QuoteDocMethods,
  QuoteCollectionMethods
>

export const quoteSchema: RxJsonSchema<QuoteDocType> = quoteSchemaLiteral
