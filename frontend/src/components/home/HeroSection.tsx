import { Link } from "react-router-dom";
import { ArrowRight, Search, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "../shared/Button";

const stats = [
  { label: "Cities Covered", value: "120+" },
  { label: "Verified Tutors", value: "8,500+" },
  { label: "New Leads Weekly", value: "2,000+" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-hero-grid py-20 sm:py-24">
      <div className="section-shell grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-300">
            <Sparkles size={16} />
            India-first tuition marketplace
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-tight sm:text-6xl">
            Find the right tutor or the right student, faster and safer.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            GuruHome helps parents discover verified tutors and helps tutors unlock high-intent parent leads with admin-reviewed payments and role-based security.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to="/post-requirement">
              <Button className="gap-2">
                Post Requirement
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/post-availability">
              <Button variant="secondary" className="gap-2">
                Post Availability
                <Search size={16} />
              </Button>
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-panel p-5">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel relative p-6 sm:p-8">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-200/50 blur-3xl dark:bg-orange-500/10" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-green-200/60 blur-3xl dark:bg-green-500/10" />
          <div className="relative space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-semibold text-orange-500">Parent Requirement Flow</p>
              <p className="mt-2 font-semibold">Post requirement, receive matched tutors, unlock only when you choose.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">Tutor Lead Flow</p>
              <p className="mt-2 font-semibold">Buy plans or unlock specific parent contacts after admin verifies UPI payment proof.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-orange-500" size={18} />
                <p className="font-semibold">VAPT-aware architecture by default</p>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">JWT auth, rate limits, secure headers, input sanitization, approval gates, audit logs.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

