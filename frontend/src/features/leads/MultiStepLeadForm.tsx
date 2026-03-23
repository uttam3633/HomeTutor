import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, MapPin, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { api, getApiErrorMessage } from "../../api/client";
import { fetchCities, fetchSubjects } from "../../api/public";
import { Button } from "../../components/shared/Button";
import { useAuth } from "../auth/AuthProvider";

type Props = {
  type: "parent" | "tutor";
};

const parentSteps = [
  {
    id: 1,
    title: "Basic Details",
    description: "Tell us who needs support and the core subjects.",
  },
  {
    id: 2,
    title: "Learning Needs",
    description: "Add class, board, and preferred tuition mode.",
  },
  {
    id: 3,
    title: "Location & Budget",
    description: "Share address, area, timing, and budget range.",
  },
];

const tutorSteps = [
  {
    id: 1,
    title: "Tutor Identity",
    description: "Introduce yourself and the subjects you teach.",
  },
  {
    id: 2,
    title: "Teaching Scope",
    description: "Define class range, modes, fees, and schedule.",
  },
  {
    id: 3,
    title: "Availability Setup",
    description: "Add city, area, and supporting profile details.",
  },
];

export function MultiStepLeadForm({ type }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const citiesQuery = useQuery({
    queryKey: ["public-cities"],
    queryFn: fetchCities,
  });

  const subjectsQuery = useQuery({
    queryKey: ["public-subjects"],
    queryFn: fetchSubjects,
  });

  const steps = type === "parent" ? parentSteps : tutorSteps;
  const activeStep = steps[step - 1];
  const progress = `${(step / steps.length) * 100}%`;
  const subjectExamples = subjectsQuery.data?.slice(0, 6).map((item) => item.name) ?? [];
  const cityExamples = citiesQuery.data?.slice(0, 4).map((item) => item.name) ?? [];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login before posting.");
      navigate("/login");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const subjectList = String(formData.get("subjects") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (subjectList.length === 0) {
      toast.error("Add at least one subject");
      return;
    }

    setLoading(true);
    try {
      if (type === "parent") {
        await api.post("/parent/requirements", {
          parent_name: formData.get("name"),
          mobile: formData.get("mobile"),
          email: formData.get("email") || null,
          child_name: formData.get("child_name"),
          class_name: formData.get("class_name"),
          board: formData.get("board"),
          subjects: subjectList,
          mode: formData.get("mode"),
          address: formData.get("address"),
          city: formData.get("city"),
          area: formData.get("area"),
          pincode: formData.get("pincode"),
          budget: Number(formData.get("budget")),
          preferred_time: formData.get("preferred_time"),
          start_date: formData.get("start_date") || null,
          notes: formData.get("notes") || null,
        });
      } else {
        await api.post("/tutor/availability", {
          tutor_name: formData.get("name"),
          subjects: subjectList,
          class_range: formData.get("class_range"),
          experience: Number(formData.get("experience")),
          mode: String(formData.get("mode")).split(",").map((item) => item.trim()),
          city: formData.get("city"),
          area: formData.get("area"),
          fees: Number(formData.get("fees")),
          available_time: formData.get("available_time"),
          demo_available: formData.get("demo_available") === "on",
          profile_photo: formData.get("profile_photo") || null,
          documents: String(formData.get("documents") || "").split(",").filter(Boolean),
        });
      }
      toast.success(type === "parent" ? "Requirement posted" : "Availability posted");
      formRef.current?.reset();
      setStep(1);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="glass-panel interactive-card space-y-6 p-6 sm:p-8">
      {!isAuthenticated ? (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-300">
          You need to <Link to="/login" className="font-semibold underline">login</Link> before posting.
        </div>
      ) : null}

      <div className="rounded-[2rem] border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-950/50">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
              Step {step} of {steps.length}
            </p>
            <h2 className="mt-2 text-2xl font-bold">{activeStep.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{activeStep.description}</p>
          </div>
          <div className="flex items-center gap-3">
            {steps.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(item.id)}
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition ${
                    step === item.id
                      ? "scale-105 bg-ink text-white dark:bg-orange-500 dark:text-slate-950"
                      : step > item.id
                        ? "bg-orange-500 text-white"
                        : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {step > item.id ? <CheckCircle2 size={18} /> : item.id}
                </button>
                {item.id < steps.length ? <div className="hidden h-1 w-10 rounded-full bg-slate-200 sm:block dark:bg-slate-800" /> : null}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300" style={{ width: progress }} />
        </div>
      </div>

      {step === 1 && (
        <div className="form-stage space-y-5">
          <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 dark:border-slate-700">
              <UserRound size={14} />
              Identity first
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 dark:border-slate-700">
              <ArrowRight size={14} />
              Match quality improves with clear subjects
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input name="name" className="field" placeholder={type === "parent" ? "Parent name" : "Tutor name"} required />
            <input name={type === "parent" ? "mobile" : "experience"} className="field" placeholder={type === "parent" ? "Mobile number" : "Experience in years"} required />
            <input name="email" className="field" placeholder="Email (optional)" />
            <input
              name="subjects"
              className="field"
              placeholder={
                subjectsQuery.data?.length
                  ? `Subjects, comma separated. Examples: ${subjectsQuery.data.slice(0, 3).map((item) => item.name).join(", ")}`
                  : "Subjects, comma separated"
              }
              required
            />
          </div>
          {subjectExamples.length ? (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Popular Subjects</p>
              <div className="flex flex-wrap gap-2">
                {subjectExamples.map((item) => (
                  <span key={item} className="rounded-full bg-orange-50 px-3 py-2 text-xs font-medium text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {step === 2 && (
        <div className="form-stage grid gap-4 md:grid-cols-2">
          {type === "parent" ? (
            <>
              <input name="child_name" className="field" placeholder="Child name" required />
              <input name="class_name" className="field" placeholder="Class" required />
              <input name="board" className="field" placeholder="Board" required />
              <select name="mode" className="field" defaultValue="home">
                <option value="home">Home</option>
                <option value="online">Online</option>
                <option value="group">Group</option>
                <option value="institute">Institute</option>
              </select>
            </>
          ) : (
            <>
              <input name="class_range" className="field" placeholder="Class range" required />
              <input name="mode" className="field" placeholder="Modes, comma separated" required />
              <input name="fees" className="field" placeholder="Fees" required />
              <input name="available_time" className="field" placeholder="Available time" required />
            </>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="form-stage space-y-5">
          {cityExamples.length ? (
            <div className="flex flex-wrap gap-2">
              {cityExamples.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                  <MapPin size={12} />
                  {item}
                </span>
              ))}
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="city"
              className="field"
              placeholder={citiesQuery.data?.length ? `City. Examples: ${citiesQuery.data.slice(0, 3).map((item) => item.name).join(", ")}` : "City"}
              required
            />
            <input name="area" className="field" placeholder="Area" required />
            {type === "parent" ? (
              <>
                <input name="address" className="field md:col-span-2" placeholder="Address" required />
                <input name="pincode" className="field" placeholder="Pincode" required />
                <input name="budget" className="field" placeholder="Budget" required />
                <input name="preferred_time" className="field" placeholder="Preferred time" required />
                <input name="start_date" className="field" type="date" />
                <textarea name="notes" className="field md:col-span-2 min-h-28" placeholder="Notes" />
              </>
            ) : (
              <>
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                  <input name="demo_available" type="checkbox" />
                  Demo available
                </label>
                <input name="profile_photo" className="field" placeholder="Profile photo URL" />
                <input name="documents" className="field md:col-span-2" placeholder="Document URLs, comma separated" />
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {step < 3 ? "Complete this section and move forward." : "Final check before posting."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" disabled={step === 1} onClick={() => setStep((current) => Math.max(1, current - 1))}>
          Previous
          </Button>
          {step < 3 ? (
            <Button type="button" className="gap-2" onClick={() => setStep((current) => Math.min(3, current + 1))}>
              Next
              <ArrowRight size={16} />
            </Button>
          ) : (
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? "Submitting..." : type === "parent" ? "Post Requirement" : "Post Availability"}
              {!loading ? <CheckCircle2 size={16} /> : null}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

