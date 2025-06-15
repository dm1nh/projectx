import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxCollection,
  type RxDocument,
  type RxJsonSchema,
} from "rxdb/plugins/core"

export const productSchemaLiteral = {
  title: "product schema",
  description: "includes product name, quantity and tax",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    name: { type: "string" },
    unitPrice: { type: "integer", minimum: 0, default: 0 },
    unit: { type: "string" },
    quantity: { type: "integer", minimum: 1, default: 1 },
    vat: { type: "integer", minimum: 0, default: 0 },
    type: { type: "string", enum: ["1", "2", "3"], default: "1" },
  },
  required: ["id", "name", "unitPrice", "unit", "quantity", "vat", "type"],
} as const

export const productSchemaTyped = toTypedRxJsonSchema(productSchemaLiteral)

export type ProductDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof productSchemaTyped
>

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type ProductDocMethods = {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type ProductCollectionMethods = {}

export type ProductDoc = RxDocument<ProductDocType>

export type ProductCollection = RxCollection<
  ProductDocType,
  ProductDocMethods,
  ProductCollectionMethods
>

export const productSchema: RxJsonSchema<ProductDocType> = productSchemaLiteral
