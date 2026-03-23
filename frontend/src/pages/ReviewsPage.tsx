import { CardCarousel } from "../components/home/CardCarousel";
import { SectionHeading } from "../components/shared/SectionHeading";

const reviews = [
  { title: "Parent from Pune", subtitle: "4.9/5 rating", meta: "The tutor shortlist felt curated and the unlock flow was transparent." },
  { title: "Tutor from Delhi", subtitle: "4.8/5 rating", meta: "Subscription plus single lead unlocks gave me enough flexibility." },
  { title: "Parent from Chennai", subtitle: "5/5 rating", meta: "Admin approval added confidence when uploading payment proof." },
];

export function ReviewsPage() {
  return (
    <section className="section-shell py-14">
      <SectionHeading eyebrow="Reviews" title="Social proof from both sides of the marketplace" description="Approved parent and tutor reviews improve trust and help future users make faster decisions." />
      <div className="mt-10">
        <CardCarousel cards={reviews} />
      </div>
    </section>
  );
}

