import { useQuery } from "@tanstack/react-query";

import { fetchReviews } from "../api/public";
import { getApiErrorMessage } from "../api/client";
import { CardCarousel } from "../components/home/CardCarousel";
import { QueryState } from "../components/shared/QueryState";
import { SectionHeading } from "../components/shared/SectionHeading";

export function ReviewsPage() {
  const reviewsQuery = useQuery({
    queryKey: ["reviews-page"],
    queryFn: fetchReviews,
  });

  const cards =
    (reviewsQuery.data ?? []).map((review) => ({
      title: `${"★".repeat(review.rating)} ${review.tutor_name}`,
      subtitle: `Review by ${review.parent_name}`,
      meta: review.comment ?? "Approved platform review.",
    }));

  return (
    <section className="section-shell page-entrance py-14">
      <SectionHeading eyebrow="Reviews" title="Social proof from both sides of the marketplace" description="Approved parent and tutor reviews improve trust and help future users make faster decisions." />
      <div className="mt-10">
        <QueryState
          isLoading={reviewsQuery.isLoading}
          errorMessage={reviewsQuery.error ? getApiErrorMessage(reviewsQuery.error) : null}
          empty={cards.length === 0}
          emptyTitle="No reviews available"
          emptyDescription="Approved reviews will appear here as users submit them."
        >
          <CardCarousel cards={cards} />
        </QueryState>
      </div>
    </section>
  );
}

