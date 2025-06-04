import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { UserNav } from './UserNav'; // UserNav will be created later

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Logo />
        <nav className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/ngo">NGO Portal</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/lawyer">Lawyer Portal</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/donor">Donor Portal</Link>
          </Button>
          <UserNav />
        </nav>
      </div>
    </header>
  );
}
