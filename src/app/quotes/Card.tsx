import { format } from "date-fns"
import { Link } from "react-router"

import { type QuoteDoc } from "@/lib/db/schemas"

export function QuoteCard({ quote }: { quote: QuoteDoc }) {
  return (
    <Link
      to={`/projectx/quotes/${quote.id}`}
      className="hover:border-accent space-y-1 rounded-lg border p-4 duration-150"
    >
      <p>#{quote.id}</p>
      <p>{quote.no}</p>
      <h3 className="text-xl font-semibold">{quote.customerName}</h3>
      <p>{quote.phoneNumber}</p>
      <p>{quote.address}</p>
      <p className="text-muted-foreground">{format(quote.date, "dd-MM-yyy")}</p>
    </Link>
  )
}
