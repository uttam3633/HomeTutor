import { DashboardLayout } from "../features/dashboard/DashboardLayout";
import { StatGrid } from "../features/dashboard/StatGrid";

export function TutorDashboardPage() {
  return (
    <DashboardLayout title="Tutor Dashboard" subtitle="Manage profile approval, active leads, subscriptions, and earnings.">
      <StatGrid items={[{ label: "Availabilities", value: "6" }, { label: "Unlocked Leads", value: "17" }, { label: "Subscription Credits", value: "25" }, { label: "Average Rating", value: "4.9" }]} />
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold">Lead Funnel</h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">The production route for this panel is `/tutor/dashboard`, including current subscription and payment status.</p>
      </div>
    </DashboardLayout>
  );
}

