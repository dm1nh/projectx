import {
  addRxPlugin,
  createRxDatabase,
  removeRxDatabase,
  type RxDatabase,
} from "rxdb/plugins/core"
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode"
import { getRxStorageLocalstorage } from "rxdb/plugins/storage-localstorage"
import { getAjv, wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv"

import {
  productSchema,
  quoteSchema,
  type ProductCollection,
  type QuoteCollection,
} from "./schemas"

addRxPlugin(RxDBDevModePlugin)

const ajv = getAjv()
ajv.addFormat("date-time", {
  type: "string",
  validate: (v) =>
    /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-]\d{2}:\d{2}))?$/.test(
      v,
    ),
})

type DbCollection = {
  quotes: QuoteCollection
  products: ProductCollection
}

export async function createDb() {
  const storage = wrappedValidateAjvStorage({
    storage: getRxStorageLocalstorage(),
  })
  removeRxDatabase("database", storage)

  const db: RxDatabase<DbCollection> = await createRxDatabase({
    name: "database",
    storage,
    ignoreDuplicate: true,
    multiInstance: false,
  })

  await db.addCollections({
    quotes: {
      schema: quoteSchema,
    },
    products: {
      schema: productSchema,
    },
  })

  return db
}
