import { Logo } from "./Logo"
import { Nav } from "./Nav"
import { Container } from "./shared/Container"

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground">
      <Container className="flex h-16 items-center gap-8">
        <Logo />
        <Nav />
      </Container>
    </header>
  )
}
