import { nanoid } from "nanoid"
import {
  addRxPlugin,
  createRxDatabase,
  removeRxDatabase,
  type RxDatabase,
} from "rxdb/plugins/core"
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode"
import { getRxStorageLocalstorage } from "rxdb/plugins/storage-localstorage"
import { RxDBUpdatePlugin } from "rxdb/plugins/update"
import { getAjv, wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv"

import {
  productSchema,
  quoteSchema,
  type ProductCollection,
  type QuoteCollection,
} from "./schemas"

addRxPlugin(RxDBUpdatePlugin)

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

let dbPromise: RxDatabase<DbCollection> | null

async function _create() {
  const storage = wrappedValidateAjvStorage({
    storage: getRxStorageLocalstorage(),
  })

  if (import.meta.env.MODE === "development") {
    removeRxDatabase("database", storage)
  }

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

  await db.quotes.insertIfNotExists({
    id: "1",
    no: "4NS1234",
    customerName: "John Parker",
    phoneNumber: "0909123456",
    address: "17/3 Tran Quang Co, phuong Phu Thanh, TPHCM",
    taxCode: "11111111111",
    carModel: "Ford Everest 2025",
    carOdometer: 400_000,
    carRegistrationNumber: "63L-71234",
    carVin: "1S2A4F",
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  })

  return db
}

export async function createDb() {
  if (!dbPromise) {
    dbPromise = await _create()
  }
  return dbPromise
}
