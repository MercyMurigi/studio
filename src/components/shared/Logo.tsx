import Link from 'next/link';
import { Scale } from 'lucide-react'; // Using Scale as a representative icon for justice

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group" aria-label="HakiChain Homepage">
      <Scale className="h-8 w-8 text-primary group-hover:text-primary/80 transition-colors duration-150 ease-in-out" />
      <span className="text-2xl font-headline">
        <span className="font-bold text-primary group-hover:text-primary/80 transition-colors duration-150 ease-in-out">Haki</span>
        <span className="font-bold text-secondary group-hover:text-secondary/80 transition-colors duration-150 ease-in-out">Chain</span>
      </span>
    </Link>
  );
}
