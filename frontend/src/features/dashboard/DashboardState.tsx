import type { ReactNode } from "react";

type Props = {
  isLoading: boolean;
  errorMessage?: string | null;
  children: ReactNode;
};

export function DashboardState({ isLoading, errorMessage, children }: Props) {
  if (isLoading) {
    return (
      <>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="glass-panel h-32 animate-pulse bg-white/60 p-6 dark:bg-slate-900/60" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="glass-panel h-64 animate-pulse bg-white/60 p-6 dark:bg-slate-900/60" />
          <div className="glass-panel h-64 animate-pulse bg-white/60 p-6 dark:bg-slate-900/60" />
        </div>
      </>
    );
  }

  if (errorMessage) {
    return <div className="glass-panel p-6 text-sm text-red-600 dark:text-red-300">{errorMessage}</div>;
  }

  return <>{children}</>;
}
