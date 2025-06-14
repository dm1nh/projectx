import { useLoaderData } from "react-router"

import { createDb } from "@/lib/db"

export async function loader() {
  const db = await createDb()
  const quotes = await db.quotes.find().exec()
  return quotes
}

export function QuotesPage() {
  const quotes = useLoaderData()
  return <div>{JSON.stringify(quotes)}</div>
}
