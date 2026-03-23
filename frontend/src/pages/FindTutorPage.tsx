import { SectionHeading } from "../components/shared/SectionHeading";

const tutors = [
  "CBSE Maths tutor in Noida, home tuition, 5 years experience",
  "ICSE Science tutor in Pune, online and home mode",
  "English speaking coach in Hyderabad with free demo session",
];

export function FindTutorPage() {
  return (
    <section className="section-shell py-14">
      <SectionHeading eyebrow="Find Tutor" title="Search tutors by city, subject, class, and learning mode" description="This page is ready to connect to `/public/tutors` and show filtered, approval-aware results." />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tutors.map((item) => (
          <div key={item} className="glass-panel p-6">{item}</div>
        ))}
      </div>
    </section>
  );
}

