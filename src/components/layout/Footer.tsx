
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h4 className="font-semibold mb-2 text-foreground">For NGOs</h4>
            <ul className="space-y-1">
              <li><Button variant="link" asChild className="p-0 h-auto text-muted-foreground hover:text-primary"><Link href="/auth/login">Login</Link></Button></li>
              <li><Button variant="link" asChild className="p-0 h-auto text-muted-foreground hover:text-primary"><Link href="/auth/signup?role=ngo">Register</Link></Button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-foreground">For Lawyers</h4>
            <ul className="space-y-1">
              <li><Button variant="link" asChild className="p-0 h-auto text-muted-foreground hover:text-primary"><Link href="/auth/login">Login</Link></Button></li>
              <li><Button variant="link" asChild className="p-0 h-auto text-muted-foreground hover:text-primary"><Link href="/auth/signup?role=lawyer">Register</Link></Button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-foreground">For Donors</h4>
            <ul className="space-y-1">
              <li><Button variant="link" asChild className="p-0 h-auto text-muted-foreground hover:text-primary"><Link href="/auth/login">Login</Link></Button></li>
              <li><Button variant="link" asChild className="p-0 h-auto text-muted-foreground hover:text-primary"><Link href="/auth/signup?role=donor">Register</Link></Button></li>
              <li><Button variant="link" asChild className="p-0 h-auto text-muted-foreground hover:text-primary"><Link href="/donor">Explore Bounties</Link></Button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/40 pt-8 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HakiChain. All rights reserved.</p>
          <p className="mt-1">Empowering Justice, One Case at a Time.</p>
        </div>
      </div>
    </footer>
  );
}
