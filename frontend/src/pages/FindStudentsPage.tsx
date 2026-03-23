import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { fetchParentLeads } from "../api/public";
import { getApiErrorMessage } from "../api/client";
import { QueryState } from "../components/shared/QueryState";
import { SectionHeading } from "../components/shared/SectionHeading";

export function FindStudentsPage() {
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

  const leadsQuery = useQuery({
    queryKey: ["public-parent-leads", city, subject],
    queryFn: () => fetchParentLeads({ city: city || undefined, subject: subject || undefined }),
  });

  const leads = (leadsQuery.data ?? []).filter((lead) => {
    const matchesCity = !city || lead.city.toLowerCase().includes(city.toLowerCase()) || lead.area.toLowerCase().includes(city.toLowerCase());
    const matchesSubject = !subject || lead.subjects.some((item) => item.toLowerCase().includes(subject.toLowerCase()));
    return matchesCity && matchesSubject;
  });

  return (
    <section className="section-shell page-entrance py-14">
      <SectionHeading eyebrow="Find Students" title="Browse active parent requirements and unlock verified contacts" description="Tutors can purchase leads individually or combine them with a subscription plan." />
      <div className="mt-8 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
        <input className="field" placeholder="Filter by city" value={city} onChange={(event) => updateParam("city", event.target.value)} />
        <input className="field" placeholder="Filter by subject" value={subject} onChange={(event) => updateParam("subject", event.target.value)} />
        <button type="button" className="btn-secondary" onClick={() => setSearchParams({})}>Clear</button>
      </div>
      <div className="mt-8">
        <QueryState
          isLoading={leadsQuery.isLoading}
          errorMessage={leadsQuery.error ? getApiErrorMessage(leadsQuery.error) : null}
          empty={leads.length === 0}
          emptyTitle="No parent requirements found"
          emptyDescription="Try a different city or subject to find more student leads."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {leads.map((lead) => (
              <article key={lead.id} className="panel-surface p-6">
                <p className="soft-badge border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-300">{lead.city} • {lead.area}</p>
                <h3 className="mt-3 text-xl font-bold">{lead.class_name} {lead.board}</h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{lead.subjects.join(", ")} | {lead.mode} | Budget ₹{lead.budget}</p>
                <div className="mt-4 space-y-2 text-sm">
                  <p><span className="font-semibold">Student:</span> {lead.child_name}</p>
                  <p><span className="font-semibold">Preferred time:</span> {lead.preferred_time}</p>
                  <p><span className="font-semibold">Status:</span> {lead.status}</p>
                  {lead.notes ? <p><span className="font-semibold">Notes:</span> {lead.notes}</p> : null}
                </div>
              </article>
            ))}
          </div>
        </QueryState>
      </div>
    </section>
  );
}

