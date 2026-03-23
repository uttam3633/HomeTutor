import { DashboardLayout } from "../features/dashboard/DashboardLayout";
import { StatGrid } from "../features/dashboard/StatGrid";

export function AdminDashboardPage() {
  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Approvals, pricing, audit logs, payments, moderation, and analytics.">
      <StatGrid items={[{ label: "Pending Tutor Approvals", value: "14" }, { label: "Pending Payment Proofs", value: "9" }, { label: "Today Unlocks", value: "42" }, { label: "Blocked Users", value: "3" }]} />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold">Approval Queue</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Tutor profile review, document moderation, and payment proof verification all map to backend admin routes.</p>
        </div>
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold">Audit and Security</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Audit trails, role checks, payment approval state, and secure headers are baked into the starter architecture.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

