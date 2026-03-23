import { useQuery } from "@tanstack/react-query";

import { getApiErrorMessage } from "../api/client";
import { fetchTutorDashboard } from "../api/dashboard";
import { RequireAuth } from "../features/auth/RequireAuth";
import { DashboardLayout } from "../features/dashboard/DashboardLayout";
import { DashboardPanel } from "../features/dashboard/DashboardPanel";
import { DashboardState } from "../features/dashboard/DashboardState";
import { StatGrid } from "../features/dashboard/StatGrid";

export function TutorDashboardPage() {
  const dashboardQuery = useQuery({
    queryKey: ["tutor-dashboard"],
    queryFn: fetchTutorDashboard,
  });

  const dashboard = dashboardQuery.data;

  return (
    <RequireAuth role="tutor">
      <DashboardLayout title="Tutor Dashboard" subtitle="Manage profile approval, active leads, subscriptions, and earnings.">
        <DashboardState isLoading={dashboardQuery.isLoading} errorMessage={dashboardQuery.error ? getApiErrorMessage(dashboardQuery.error) : null}>
          <StatGrid
            items={[
              { label: "Availabilities", value: String(dashboard?.stats.availabilities ?? 0) },
              { label: "Unlocked Leads", value: String(dashboard?.stats.unlocks ?? 0) },
              { label: "Payments", value: String(dashboard?.stats.payments ?? 0) },
              { label: "Subscription Credits", value: String(dashboard?.subscription?.lead_credits ?? 0) },
            ]}
          />
          <div className="grid gap-6 xl:grid-cols-2">
            <DashboardPanel title="Profile Status">
              {dashboard?.profile ? (
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Approval:</span> {dashboard.profile.approved_status}</p>
                  <p><span className="font-semibold">Subjects:</span> {dashboard.profile.subjects.join(", ")}</p>
                  <p><span className="font-semibold">Experience:</span> {dashboard.profile.experience_years} years</p>
                  <p><span className="font-semibold">Fees:</span> {dashboard.profile.fees ? `₹${dashboard.profile.fees}` : "Not set"}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">Profile not completed yet.</p>
              )}
            </DashboardPanel>
            <DashboardPanel title="Active Subscription">
              {dashboard?.subscription ? (
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Plan:</span> {dashboard.subscription.plan_name}</p>
                  <p><span className="font-semibold">Credits:</span> {dashboard.subscription.lead_credits}</p>
                  <p><span className="font-semibold">Price:</span> ₹{dashboard.subscription.price}</p>
                  <p><span className="font-semibold">Ends:</span> {new Date(dashboard.subscription.ends_at).toLocaleDateString()}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">No active subscription yet.</p>
              )}
            </DashboardPanel>
            <DashboardPanel title="Recent Availabilities">
              {dashboard?.availabilities.length ? (
                <div className="space-y-4">
                  {dashboard.availabilities.slice(0, 5).map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 p-4 text-sm dark:border-slate-800">
                      <p className="font-semibold">{item.subjects.join(", ")} • {item.class_range}</p>
                      <p className="mt-1 text-slate-600 dark:text-slate-400">{item.city}, {item.area} • ₹{item.fees}</p>
                      <p className="mt-1 text-slate-600 dark:text-slate-400">Status: {item.approved_status}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">No availability posts yet.</p>
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

