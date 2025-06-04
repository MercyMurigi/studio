import type { ReactNode } from 'react';

interface PageTitleProps {
  title: string;
  description?: string | ReactNode;
  children?: ReactNode; // For actions like a "Create New" button
}

export function PageTitle({ title, description, children }: PageTitleProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">{title}</h1>
        {children && <div className="mt-4 md:mt-0">{children}</div>}
      </div>
      {description && (
        <p className="mt-2 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
