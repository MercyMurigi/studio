import Link from 'next/link';
import { Scale } from 'lucide-react'; // Using Scale as a representative icon for justice

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
      <Scale className="h-8 w-8" />
      <span className="text-2xl font-bold font-headline">HakiChain</span>
    </Link>
  );
}
