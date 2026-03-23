import { useQuery } from "@tanstack/react-query";

import { fetchReviews, fetchTutors } from "../api/public";
import { getApiErrorMessage } from "../api/client";
import { CardCarousel } from "../components/home/CardCarousel";
import { HeroSection } from "../components/home/HeroSection";
import { SearchStrip } from "../components/home/SearchStrip";
import { QueryState } from "../components/shared/QueryState";
import { SectionHeading } from "../components/shared/SectionHeading";

export function HomePage() {
  const tutorsQuery = useQuery({
    queryKey: ["featured-tutors"],
    queryFn: () => fetchTutors(),
  });

  const reviewsQuery = useQuery({
    queryKey: ["home-reviews"],
    queryFn: fetchReviews,
  });

  const tutorCards =
    tutorsQuery.data?.slice(0, 6).map((tutor) => ({
      title: tutor.name,
      subtitle: tutor.featured ? "Featured tutor" : "Verified tutor",
      meta: `${tutor.subjects.join(", ")} | ${tutor.class_range ?? "All classes"} | ${tutor.fees ? `₹${tutor.fees}` : "Custom fees"}`,
    })) ?? [];

  const reviewCards =
    reviewsQuery.data?.slice(0, 6).map((review) => ({
      title: `${"★".repeat(review.rating)} ${review.tutor_name}`,
      subtitle: `Review by ${review.parent_name}`,
      meta: review.comment ?? "Verified review submitted through GuruHome.",
    })) ?? [];

  return (
    <>
      <HeroSection />
      <SearchStrip />
      <section className="section-shell py-10">
        <SectionHeading eyebrow="Featured Tutors" title="Profiles designed to convert on first glance" description="Tutor cards highlight teaching strength, mode, pricing, and verification state for quick parent decisions." />
        <div className="mt-10">
          <QueryState
            isLoading={tutorsQuery.isLoading}
            errorMessage={tutorsQuery.error ? getApiErrorMessage(tutorsQuery.error) : null}
            empty={tutorCards.length === 0}
            emptyTitle="No approved tutors yet"
            emptyDescription="Once tutor profiles are approved, featured cards will appear here."
          >
            <CardCarousel cards={tutorCards} />
          </QueryState>
        </div>
      </section>
      <section className="section-shell py-20">
        <SectionHeading eyebrow="Real Feedback" title="Review carousel with platform trust signals" description="Approved reviews help parents choose better and help tutors build stronger credibility." />
        <div className="mt-10">
          <QueryState
            isLoading={reviewsQuery.isLoading}
            errorMessage={reviewsQuery.error ? getApiErrorMessage(reviewsQuery.error) : null}
            empty={reviewCards.length === 0}
            emptyTitle="No approved reviews yet"
            emptyDescription="Parent and tutor reviews will show up here after moderation."
          >
            <CardCarousel cards={reviewCards} />
          </QueryState>
        </div>
      </section>
    </>
  );
}

