import { SectionHeading } from "../components/shared/SectionHeading";
import { PricingGrid } from "../features/pricing/PricingGrid";

export function PricingPage() {
  return (
    <section className="section-shell py-14">
      <SectionHeading eyebrow="Pricing" title="Lead unlocks and tutor plans designed for real demand" description="Parents can pay to unlock tutor contacts, tutors can unlock parent requirements, and subscriptions support recurring lead access." />
      <div className="mt-10">
        <PricingGrid />
      </div>
    </section>
  );
}

