import type { ReactNode } from "react";

type Props = {
  isLoading: boolean;
  errorMessage?: string | null;
  empty: boolean;
  emptyTitle: string;
  emptyDescription: string;
  children: ReactNode;
};

export function QueryState({ isLoading, errorMessage, empty, emptyTitle, emptyDescription, children }: Props) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="glass-panel h-40 animate-pulse bg-white/60 p-6 dark:bg-slate-900/60" />
        ))}
      </div>
    );
  }

  if (errorMessage) {
    return <div className="glass-panel p-6 text-sm text-red-600 dark:text-red-300">{errorMessage}</div>;
  }

  if (empty) {
    return (
      <div className="glass-panel p-8">
        <h3 className="text-xl font-bold">{emptyTitle}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{emptyDescription}</p>
      </div>
    );
  }

  return <>{children}</>;
}
