import { DashboardLayout } from "../features/dashboard/DashboardLayout";
import { StatGrid } from "../features/dashboard/StatGrid";

export function ParentDashboardPage() {
  return (
    <DashboardLayout title="Parent Dashboard" subtitle="Track requirements, unlocked tutors, and payment verification status.">
      <StatGrid items={[{ label: "Requirements", value: "12" }, { label: "Unlocked Tutors", value: "8" }, { label: "Pending Payments", value: "2" }, { label: "Reviews Submitted", value: "5" }]} />
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold">Recent Activity</h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">This dashboard is designed to connect directly to `/parent/dashboard` for real stats and payment history.</p>
      </div>
    </DashboardLayout>
  );
}

