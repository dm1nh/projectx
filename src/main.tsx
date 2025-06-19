import { StrictMode } from "react"

import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"

// @ts-expect-error something wrong with tsconfig
import "@fontsource-variable/roboto"
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
        path: "projectx",
        index: true,
        Component: HomePage,
      },
      {
        path: "projectx/quotes",
        shouldRevalidate,
        children: [
          { index: true, loader: quotesLoader, Component: QuotesPage },
          {
            path: ":id",
            shouldRevalidate,
            // @ts-expect-error lazy to fix this
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
    path: "projectx/quotes/:id/print",
    shouldRevalidate,
    // @ts-expect-error lazy to fix this
    loader: printQuoteLoader,
    Component: PrintQuotePage,
  },
  {
    path: "*",
    Component: () => <div>404 Not Found</div>,
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
