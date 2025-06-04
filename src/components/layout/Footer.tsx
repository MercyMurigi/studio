export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 py-8">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} HakiChain. All rights reserved.</p>
        <p className="mt-1">Empowering Justice, One Case at a Time.</p>
      </div>
    </footer>
  );
}
