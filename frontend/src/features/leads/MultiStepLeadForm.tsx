import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { api, getApiErrorMessage } from "../../api/client";
import { fetchCities, fetchSubjects } from "../../api/public";
import { Button } from "../../components/shared/Button";
import { useAuth } from "../auth/AuthProvider";

type Props = {
  type: "parent" | "tutor";
};

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
    <form ref={formRef} onSubmit={handleSubmit} className="glass-panel space-y-6 p-6 sm:p-8">
      {!isAuthenticated ? (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-300">
          You need to <Link to="/login" className="font-semibold underline">login</Link> before posting.
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3">
        {[1, 2, 3].map((value) => (
          <div
            key={value}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${step >= value ? "bg-orange-500 text-white" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}
          >
            {value}
          </div>
        ))}
      </div>

      {step === 1 && (
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
      )}

      {step === 2 && (
        <div className="grid gap-4 md:grid-cols-2">
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
      )}

      <div className="flex flex-wrap justify-between gap-3">
        <Button type="button" variant="secondary" onClick={() => setStep((current) => Math.max(1, current - 1))}>
          Previous
        </Button>
        {step < 3 ? (
          <Button type="button" onClick={() => setStep((current) => Math.min(3, current + 1))}>
            Next
          </Button>
        ) : (
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : type === "parent" ? "Post Requirement" : "Post Availability"}
          </Button>
        )}
      </div>
    </form>
  );
}

