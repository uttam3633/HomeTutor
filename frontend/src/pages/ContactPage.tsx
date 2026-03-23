import { FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "../components/shared/Button";

export function ContactPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.success("Message submitted. We will get back to you soon.");
    event.currentTarget.reset();
  }

  return (
    <section className="section-shell page-entrance py-14">
      <form onSubmit={handleSubmit} className="panel-surface max-w-2xl p-8">
        <h1 className="font-display text-4xl font-bold">Contact Us</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">For sales, support, or partnership inquiries, integrate this page with your CRM or support inbox.</p>
        <div className="mt-8 grid gap-4">
          <input className="field" placeholder="Your name" required />
          <input className="field" placeholder="Email" type="email" required />
          <textarea className="field min-h-32" placeholder="How can we help?" required />
        </div>
        <div className="mt-6">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </section>
  );
}

