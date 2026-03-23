import { SectionHeading } from "../components/shared/SectionHeading";

const leads = [
  "Class 8 CBSE Maths in Lucknow, evening slot, budget ₹5,000",
  "NEET Biology in Jaipur, online, start this week",
  "Class 5 all subjects in Kolkata, home tuition preferred",
];

export function FindStudentsPage() {
  return (
    <section className="section-shell py-14">
      <SectionHeading eyebrow="Find Students" title="Browse active parent requirements and unlock verified contacts" description="Tutors can purchase leads individually or combine them with a subscription plan." />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {leads.map((item) => (
          <div key={item} className="glass-panel p-6">{item}</div>
        ))}
      </div>
    </section>
  );
}

