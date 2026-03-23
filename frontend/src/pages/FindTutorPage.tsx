import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { fetchTutors } from "../api/public";
import { getApiErrorMessage } from "../api/client";
import { QueryState } from "../components/shared/QueryState";
import { SectionHeading } from "../components/shared/SectionHeading";

export function FindTutorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const city = searchParams.get("city") ?? "";
  const subject = searchParams.get("subject") ?? "";

  function updateParam(key: "city" | "subject", value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  }

  const tutorsQuery = useQuery({
    queryKey: ["public-tutors", city, subject],
    queryFn: () => fetchTutors({ city: city || undefined, subject: subject || undefined }),
  });

  return (
    <section className="section-shell py-14">
      <SectionHeading eyebrow="Find Tutor" title="Search tutors by city and subject" description="Results here are loaded from the public tutor directory and reflect approved tutor profiles." />
      <div className="mt-8 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
        <input className="field" placeholder="Filter by city" value={city} onChange={(event) => updateParam("city", event.target.value)} />
        <input className="field" placeholder="Filter by subject" value={subject} onChange={(event) => updateParam("subject", event.target.value)} />
        <button type="button" className="btn-secondary" onClick={() => setSearchParams({})}>Clear</button>
      </div>
      <div className="mt-8">
        <QueryState
          isLoading={tutorsQuery.isLoading}
          errorMessage={tutorsQuery.error ? getApiErrorMessage(tutorsQuery.error) : null}
          empty={!tutorsQuery.data || tutorsQuery.data.length === 0}
          emptyTitle="No tutors found"
          emptyDescription="Try adjusting the city or subject filter to broaden the search."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tutorsQuery.data?.map((tutor) => (
              <article key={tutor.id} className="glass-panel p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">{tutor.featured ? "Featured tutor" : "Verified tutor"}</p>
                <h3 className="mt-3 text-xl font-bold">{tutor.name}</h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{tutor.bio ?? "Experienced tutor profile available on request."}</p>
                <div className="mt-4 space-y-2 text-sm">
                  <p><span className="font-semibold">Subjects:</span> {tutor.subjects.join(", ")}</p>
                  <p><span className="font-semibold">Class range:</span> {tutor.class_range ?? "Flexible"}</p>
                  <p><span className="font-semibold">Experience:</span> {tutor.experience_years} years</p>
                  <p><span className="font-semibold">Fees:</span> {tutor.fees ? `₹${tutor.fees}` : "Contact for pricing"}</p>
                </div>
              </article>
            ))}
          </div>
        </QueryState>
      </div>
    </section>
  );
}

