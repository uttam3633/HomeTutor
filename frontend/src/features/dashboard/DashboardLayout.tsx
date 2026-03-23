import { ReactNode } from "react";
import { BarChart3, CreditCard, LayoutDashboard, ListChecks, Shield } from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

const sidebar = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Leads", icon: ListChecks },
  { label: "Payments", icon: CreditCard },
  { label: "Analytics", icon: BarChart3 },
  { label: "Security", icon: Shield },
];

export function DashboardLayout({ title, subtitle, children }: Props) {
  return (
    <section className="section-shell page-entrance py-10">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="panel-surface h-fit p-5">
          <p className="font-display text-2xl font-bold">{title}</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
          <div className="mt-6 space-y-2">
            {sidebar.map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-900">
                <item.icon size={16} />
                {item.label}
              </div>
            ))}
          </div>
        </aside>
        <div className="space-y-6">{children}</div>
      </div>
    </section>
  );
}

