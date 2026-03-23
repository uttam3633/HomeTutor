import { useQuery } from "@tanstack/react-query";

import { getApiErrorMessage } from "../api/client";
import { fetchAdminDashboard } from "../api/dashboard";
import { RequireAuth } from "../features/auth/RequireAuth";
import { DashboardLayout } from "../features/dashboard/DashboardLayout";
import { DashboardPanel } from "../features/dashboard/DashboardPanel";
import { DashboardState } from "../features/dashboard/DashboardState";
import { StatGrid } from "../features/dashboard/StatGrid";

export function AdminDashboardPage() {
  const dashboardQuery = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchAdminDashboard,
  });

  const dashboard = dashboardQuery.data;

  return (
    <RequireAuth role="admin">
      <DashboardLayout title="Admin Dashboard" subtitle="Approvals, pricing, audit logs, payments, moderation, and analytics.">
        <DashboardState isLoading={dashboardQuery.isLoading} errorMessage={dashboardQuery.error ? getApiErrorMessage(dashboardQuery.error) : null}>
          <StatGrid
            items={[
              { label: "Users", value: String(dashboard?.analytics.users ?? 0) },
              { label: "Payments", value: String(dashboard?.analytics.payments ?? 0) },
              { label: "Verified Payments", value: String(dashboard?.analytics.verified_payments ?? 0) },
              { label: "Lead Unlocks", value: String(dashboard?.analytics.lead_unlocks ?? 0) },
            ]}
          />
          <div className="grid gap-6 xl:grid-cols-2">
            <DashboardPanel title="Pending Tutor Approvals">
              {dashboard?.pending_tutors.length ? (
                <div className="space-y-4">
                  {dashboard.pending_tutors.slice(0, 5).map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 p-4 text-sm dark:border-slate-800">
                      <p className="font-semibold">{item.subjects.join(", ") || "Tutor profile"}</p>
                      <p className="mt-1 text-slate-600 dark:text-slate-400">Class range: {item.class_range ?? "Flexible"} • {item.experience_years} years</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">No pending tutor approvals.</p>
              )}
            </DashboardPanel>
            <DashboardPanel title="Pending Availability Approvals">
              {dashboard?.pending_leads.length ? (
                <div className="space-y-4">
                  {dashboard.pending_leads.slice(0, 5).map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 p-4 text-sm dark:border-slate-800">
                      <p className="font-semibold">{item.tutor_name}</p>
                      <p className="mt-1 text-slate-600 dark:text-slate-400">{item.subjects.join(", ")} • {item.city}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">No pending availability reviews.</p>
              )}
            </DashboardPanel>
            <DashboardPanel title="Recent Payments">
              {dashboard?.recent_payments.length ? (
                <div className="space-y-4">
                  {dashboard.recent_payments.map((payment) => (
                    <div key={payment.id} className="rounded-2xl border border-slate-200 p-4 text-sm dark:border-slate-800">
                      <p className="font-semibold">{payment.purpose}</p>
                      <p className="mt-1 text-slate-600 dark:text-slate-400">Amount: ₹{payment.amount} • Status: {payment.status}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">No payment activity yet.</p>
              )}
            </DashboardPanel>
            <DashboardPanel title="Analytics Snapshot">
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">Parent leads: {dashboard?.analytics.parent_leads ?? 0}</div>
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">Tutor leads: {dashboard?.analytics.tutor_leads ?? 0}</div>
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">Payments: {dashboard?.analytics.payments ?? 0}</div>
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">Unlocks: {dashboard?.analytics.lead_unlocks ?? 0}</div>
              </div>
            </DashboardPanel>
          </div>
        </DashboardState>
      </DashboardLayout>
    </RequireAuth>
  );
}

