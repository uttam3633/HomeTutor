import { MultiStepLeadForm } from "../features/leads/MultiStepLeadForm";

export function PostRequirementPage() {
  return (
    <section className="section-shell py-14">
      <div className="mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-bold">Post a Tuition Requirement</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">Structured multi-step form for parents with budget, class, subject, mode, and timing details.</p>
      </div>
      <MultiStepLeadForm type="parent" />
    </section>
  );
}

