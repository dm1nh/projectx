import { format } from "date-fns"
import { Link } from "react-router"

import { type QuoteDoc } from "@/lib/db/schemas"

export function QuoteCard({ quote }: { quote: QuoteDoc }) {
  return (
    <Link
      to={`/quotes/${quote.id}`}
      className="group space-y-1 rounded-lg border p-4 duration-150 hover:shadow-md"
    >
      <h3 className="text-xl font-semibold duration-150 group-hover:text-blue-500">
        {quote.customerName}
      </h3>
      <p>{quote.phoneNumber}</p>
      <p className="text-muted-foreground">{format(quote.date, "dd-MM-yyy")}</p>
    </Link>
  )
}
