import Link from 'next/link';
import { Gavel } from 'lucide-react'; // Using Gavel as a representative icon

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
      <Gavel className="h-8 w-8" />
      <span className="text-2xl font-bold font-headline">HakiChain Advocate</span>
    </Link>
  );
}
