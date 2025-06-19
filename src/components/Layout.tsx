import { Outlet } from "react-router"

import PWABadge from "../PWABadge"
import { Header } from "./Header"
import { Container } from "./shared/Container"
import { Toaster } from "./ui/sonner"

export function RootLayout() {
  return (
    <>
      <Header />
      <Container className="py-8">
        <Outlet />
      </Container>
      <PWABadge />
      <Toaster />
    </>
  )
}
