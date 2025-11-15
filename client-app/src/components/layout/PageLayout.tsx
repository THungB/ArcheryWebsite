import { ReactNode } from 'react';
import { cn } from '../ui/utils';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {children}
    </div>
  );
}

interface HeaderProps {
  title: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}

export function Header({ title, description, className, children }: HeaderProps) {
  return (
    <header className={cn('bg-card border-b shadow-sm', className)}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </header>
  );
}

interface MainContentProps {
  children: ReactNode;
  className?: string;
}

export function MainContent({ children, className }: MainContentProps) {
  return (
    <main className={cn('container mx-auto px-4 py-6', className)}>
      {children}
    </main>
  );
}

interface CardGridProps {
  children: ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function CardGrid({ children, className, cols = 3 }: CardGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6',
  };

  return (
    <div className={cn('grid gap-4', gridCols[cols], className)}>
      {children}
    </div>
  );
}
