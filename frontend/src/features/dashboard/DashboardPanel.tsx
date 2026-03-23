import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export function DashboardPanel({ title, children }: Props) {
  return (
    <div className="panel-surface p-6">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
