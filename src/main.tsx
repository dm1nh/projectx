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
import { loader as quotesLoader, QuotesPage } from "@/app/quotes/Page"
import { RootLayout } from "@/components/Layout"

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
        children: [
          { index: true, loader: quotesLoader, Component: QuotesPage },
          {
            path: ":id",
            loader: quoteLoader,
            Component: QuotePage,
          },
          {
            path: "form",
            loader: quoteFormLoader,
            Component: QuoteFormPage,
          },
        ],
      },
    ],
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
