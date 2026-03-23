import { useQuery } from "@tanstack/react-query";

import { getApiErrorMessage } from "../api/client";
import { fetchParentDashboard } from "../api/dashboard";
import { DashboardLayout } from "../features/dashboard/DashboardLayout";
import { DashboardPanel } from "../features/dashboard/DashboardPanel";
import { DashboardState } from "../features/dashboard/DashboardState";
import { StatGrid } from "../features/dashboard/StatGrid";
import { RequireAuth } from "../features/auth/RequireAuth";

export function ParentDashboardPage() {
  const dashboardQuery = useQuery({
    queryKey: ["parent-dashboard"],
    queryFn: fetchParentDashboard,
  });

  const dashboard = dashboardQuery.data;

  return (
    <RequireAuth role="parent">
      <DashboardLayout title="Parent Dashboard" subtitle="Track requirements, unlocked tutors, and payment verification status.">
        <DashboardState isLoading={dashboardQuery.isLoading} errorMessage={dashboardQuery.error ? getApiErrorMessage(dashboardQuery.error) : null}>
          <StatGrid
            items={[
              { label: "Requirements", value: String(dashboard?.stats.requirements ?? 0) },
              { label: "Unlocked Tutors", value: String(dashboard?.stats.unlocks ?? 0) },
              { label: "Payments", value: String(dashboard?.stats.payments ?? 0) },
              { label: "Recent Activity", value: String(dashboard?.requirements.length ?? 0) },
            ]}
          />
          <div className="grid gap-6 xl:grid-cols-2">
            <DashboardPanel title="Recent Requirements">
              {dashboard?.requirements.length ? (
                <div className="space-y-4">
                  {dashboard.requirements.slice(0, 5).map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 p-4 text-sm dark:border-slate-800">
                      <p className="font-semibold">{item.child_name} • {item.class_name} {item.board}</p>
                      <p className="mt-1 text-slate-600 dark:text-slate-400">{item.city}, {item.area} • Budget ₹{item.budget}</p>
                      <p className="mt-1 text-slate-600 dark:text-slate-400">Preferred time: {item.preferred_time} • Status: {item.status}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">No requirements posted yet.</p>
              )}
            </DashboardPanel>
            <DashboardPanel title="Payment History">
              {dashboard?.payments.length ? (
                <div className="space-y-4">
                  {dashboard.payments.map((payment) => (
                    <div key={payment.id} className="rounded-2xl border border-slate-200 p-4 text-sm dark:border-slate-800">
                      <p className="font-semibold">{payment.purpose}</p>
                      <p className="mt-1 text-slate-600 dark:text-slate-400">Amount: ₹{payment.amount} • Status: {payment.status}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">No payment records yet.</p>
              )}
            </DashboardPanel>
          </div>
        </DashboardState>
      </DashboardLayout>
    </RequireAuth>
  );
}

