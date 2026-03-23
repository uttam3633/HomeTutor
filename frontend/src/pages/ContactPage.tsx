export function ContactPage() {
  return (
    <section className="section-shell py-14">
      <div className="glass-panel max-w-2xl p-8">
        <h1 className="font-display text-4xl font-bold">Contact Us</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">For sales, support, or partnership inquiries, integrate this page with your CRM or support inbox.</p>
        <div className="mt-8 grid gap-4">
          <input className="field" placeholder="Your name" />
          <input className="field" placeholder="Email" />
          <textarea className="field min-h-32" placeholder="How can we help?" />
        </div>
      </div>
    </section>
  );
}

