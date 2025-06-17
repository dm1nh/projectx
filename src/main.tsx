import { StrictMode } from "react"

import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"

import "./globals.css"

import { HomePage } from "@/app/home/Page"
import {
  loader as quoteFormLoader,
  QuoteFormPage,
} from "@/app/quotes/form/Page"
import { loader as quoteLoader, QuotePage } from "@/app/quotes/id/Page"
import {
  loader as printQuoteLoader,
  PrintQuotePage,
} from "@/app/quotes/id/Print"
import { loader as quotesLoader, QuotesPage } from "@/app/quotes/Page"
import { RootLayout } from "@/components/Layout"

function shouldRevalidate() {
  return true
}

const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "quotes",
        shouldRevalidate,
        children: [
          { index: true, loader: quotesLoader, Component: QuotesPage },
          {
            path: ":id",
            shouldRevalidate,
            loader: quoteLoader,
            Component: QuotePage,
          },
          {
            path: "form",
            shouldRevalidate,
            loader: quoteFormLoader,
            Component: QuoteFormPage,
          },
        ],
      },
    ],
  },
  {
    path: "quotes/:id/print",
    shouldRevalidate,
    loader: printQuoteLoader,
    Component: PrintQuotePage,
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
