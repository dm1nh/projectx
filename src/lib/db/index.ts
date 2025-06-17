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
    no: "01.S20250423035",
    customerName: "Nguyễn Hữu Minh",
    phoneNumber: "0365530552",
    address: "17/3 Trần Quang Cơ, Phú Thạnh, HCM",
    taxCode: "xxxxxxxxxxx",
    carModel: "Ranger 4x4 XLT MT",
    carOdometer: 410_130,
    carRegistrationNumber: "51C97207",
    carVin: "MNCLMFF80JW800254",
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  })

  const { success: products } = await db.products.bulkInsert([
    {
      id: nanoid(),
      name: "Két nước Ranger 2012-2015",
      unitPrice: 8_434_000,
      unit: "Cái",
      quantity: 1,
      vat: 8,
      type: "1",
    },
    {
      id: nanoid(),
      name: "Ống nước vào bình nước phụ",
      unitPrice: 1_452_000,
      unit: "Cái",
      quantity: 1,
      vat: 8,
      type: "1",
    },
    {
      id: nanoid(),
      name: "Ống nước Py bát",
      unitPrice: 393_000,
      unit: "Cái",
      quantity: 1,
      vat: 8,
      type: "1",
    },
    {
      id: nanoid(),
      name: "Ống gió làm mát động cơ",
      unitPrice: 2_602_000,
      unit: "Cái",
      quantity: 1,
      vat: 8,
      type: "1",
    },
    {
      id: nanoid(),
      name: "Keo dán joint động cơ",
      unitPrice: 450_000,
      unit: "Chai",
      quantity: 1,
      vat: 10,
      type: "1",
    },
    {
      id: nanoid(),
      name: "Nước làm mát động cơ màu vàng",
      unitPrice: 126_000,
      unit: "Lít",
      quantity: 8,
      vat: 10,
      type: "1",
    },
    {
      id: nanoid(),
      name: "Ly hợp quạt",
      unitPrice: 5_581_000,
      unit: "Cái",
      quantity: 1,
      vat: 8,
      type: "1",
    },
    {
      id: nanoid(),
      name: "Chữ A trên Everest 2015",
      unitPrice: 2_192_000,
      unit: "Cái",
      quantity: 1,
      vat: 8,
      type: "1",
    },
    {
      id: nanoid(),
      name: "Chữ A trên Everest 2015-2018 LH MCA",
      unitPrice: 2_192_000,
      unit: "Cái",
      quantity: 1,
      vat: 8,
      type: "1",
    },
    {
      id: nanoid(),
      name: "Rotuyn trụ",
      unitPrice: 663_000,
      unit: "Cái",
      quantity: 1,
      vat: 8,
      type: "1",
    },
    {
      id: nanoid(),
      name: "Tán chữ A dưới Ranger 2018 M16",
      unitPrice: 54_000,
      unit: "Cái",
      quantity: 1,
      vat: 10,
      type: "1",
    },
    {
      id: nanoid(),
      name: "Rotuyn thanh giằn (ngắn)",
      unitPrice: 1_967_000,
      unit: "Cái",
      quantity: 1,
      vat: 8,
      type: "1",
    },
    {
      id: nanoid(),
      name: "Bạc đạn tăng đơ curoa máy P375",
      unitPrice: 2_860_000,
      unit: "Cái",
      quantity: 1,
      vat: 8,
      type: "1",
    },
    {
      id: nanoid(),
      name: "Rotuyn lái trong",
      unitPrice: 7_405_000,
      unit: "Cái",
      quantity: 1,
      vat: 8,
      type: "1",
    },
    {
      id: nanoid(),
      name: "Gia công ép rotuyn",
      unitPrice: 180_000,
      unit: "Cái",
      quantity: 1,
      vat: 8,
      type: "2",
    },
    {
      id: nanoid(),
      name: "Cân chỉnh lái điện tử",
      unitPrice: 990_000,
      unit: "Xe",
      quantity: 1,
      vat: 8,
      type: "2",
    },
    {
      id: nanoid(),
      name: "Tiền công",
      unitPrice: 3_600_000,
      unit: "Xe",
      quantity: 1,
      vat: 8,
      type: "3",
    },
  ])

  await db.quotes.findOne("1").patch({
    products: products.map((product) => product.id),
  })

  return db
}

export async function createDb() {
  if (!dbPromise) {
    dbPromise = await _create()
  }
  return dbPromise
}
