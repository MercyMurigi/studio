import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { UserNav } from './UserNav'; 

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Logo />
        <nav className="ml-auto flex items-center space-x-4">
          <UserNav />
        </nav>
      </div>
    </header>
  );
}
