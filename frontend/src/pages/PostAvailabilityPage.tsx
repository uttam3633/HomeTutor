import { MultiStepLeadForm } from "../features/leads/MultiStepLeadForm";

export function PostAvailabilityPage() {
  return (
    <section className="section-shell py-14">
      <div className="mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-bold">Post Tutor Availability</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">Tutors can publish teaching subjects, class range, fees, demo availability, and supporting documents for approval.</p>
      </div>
      <MultiStepLeadForm type="tutor" />
    </section>
  );
}

