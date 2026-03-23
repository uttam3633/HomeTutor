import { Check } from "lucide-react";

import { Button } from "../../components/shared/Button";

const plans = [
  { name: "Starter", price: "₹499", description: "5 lead unlocks for tutors testing the platform.", features: ["Lead credits included", "Manual payment verification", "Basic support"] },
  { name: "Growth", price: "₹1,499", description: "25 lead unlocks and improved visibility.", features: ["Featured profile slot", "Priority approval queue", "Analytics access"] },
  { name: "Pro", price: "₹2,999", description: "High-volume outreach for established tutors and institutes.", features: ["Unlimited monthly browsing", "Dedicated admin support", "Top carousel placement"] },
];

export function PricingGrid() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {plans.map((plan, index) => (
        <article
          key={plan.name}
          className={`glass-panel p-6 ${index === 1 ? "ring-2 ring-orange-400" : ""}`}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">{plan.name}</p>
          <p className="mt-4 font-display text-4xl font-bold">{plan.price}</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{plan.description}</p>
          <div className="mt-6 space-y-3">
            {plan.features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-sm">
                <Check size={16} className="text-green-600" />
                {feature}
              </div>
            ))}
          </div>
          <Button className="mt-6 w-full">Choose Plan</Button>
        </article>
      ))}
    </div>
  );
}
