import { StrictMode } from "react"

import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"

import "./globals.css"

import { HomePage } from "@/app/home/Home"
import { loader as quotesLoader, QuotesPage } from "@/app/quotes/Quotes"
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
        loader: quotesLoader,
        Component: QuotesPage,
      },
    ],
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
