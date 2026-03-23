import { CardCarousel } from "../components/home/CardCarousel";
import { HeroSection } from "../components/home/HeroSection";
import { MultiStepShowcase } from "../components/home/MultiStepShowcase";
import { SearchStrip } from "../components/home/SearchStrip";
import { SectionHeading } from "../components/shared/SectionHeading";

const tutors = [
  { title: "Aditi Sharma", subtitle: "Featured tutor", meta: "Maths and Science | CBSE 6-10 | Bengaluru | 7 years experience" },
  { title: "Rahul Verma", subtitle: "Top rated tutor", meta: "Physics and JEE | Home + Online | Delhi | Demo available" },
  { title: "Neha Iyer", subtitle: "Language expert", meta: "English and IELTS | Chennai | Parent-reviewed profile" },
];

const reviews = [
  { title: "“Fast match and verified process”", subtitle: "Parent review", meta: "We found a home tutor in 2 days and only paid once we were sure." },
  { title: "“Leads felt more serious”", subtitle: "Tutor review", meta: "The payment proof and admin verification made the lead quality much better." },
  { title: "“Easy to manage on mobile”", subtitle: "Parent review", meta: "The forms were simple even from my phone. Very smooth overall." },
];

export function HomePage() {
  return (
    <>
      <HeroSection />
      <SearchStrip />
      <section className="section-shell py-20">
        <SectionHeading eyebrow="How It Works" title="Built for trust, speed, and real tuition conversions" description="GuruHome balances marketplace growth with practical approval workflows for parents, tutors, and admins." />
        <div className="mt-10">
          <MultiStepShowcase />
        </div>
      </section>
      <section className="section-shell py-10">
        <SectionHeading eyebrow="Featured Tutors" title="Profiles designed to convert on first glance" description="Tutor cards highlight teaching strength, mode, pricing, and verification state for quick parent decisions." />
        <div className="mt-10">
          <CardCarousel cards={tutors} />
        </div>
      </section>
      <section className="section-shell py-20">
        <SectionHeading eyebrow="Real Feedback" title="Review carousel with platform trust signals" description="Approved reviews help parents choose better and help tutors build stronger credibility." />
        <div className="mt-10">
          <CardCarousel cards={reviews} />
        </div>
      </section>
    </>
  );
}

