const steps = [
  "Create an account as parent or tutor",
  "Post requirement or availability through guided multi-step forms",
  "Upload payment proof to unlock verified contact details",
  "Get admin-reviewed, auditable, secure marketplace access",
];

export function MultiStepShowcase() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {steps.map((step, index) => (
        <div key={step} className="glass-panel flex items-start gap-4 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-500 font-bold text-white">{index + 1}</div>
          <p className="font-medium">{step}</p>
        </div>
      ))}
    </div>
  );
}
