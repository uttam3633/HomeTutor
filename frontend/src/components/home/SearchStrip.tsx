import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../shared/Button";

export function SearchStrip() {
  const navigate = useNavigate();
  const [target, setTarget] = useState<"tutors" | "students">("tutors");
  const [city, setCity] = useState("");
  const [subject, setSubject] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) {
      params.set("city", city.trim());
    }
    if (subject.trim()) {
      params.set("subject", subject.trim());
    }
    navigate(`/${target === "tutors" ? "find-tutor" : "find-students"}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <section className="section-shell -mt-10 relative z-10">
      <form onSubmit={handleSubmit} className="glass-panel grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_auto] lg:p-5">
        <select className="field" value={target} onChange={(event) => setTarget(event.target.value as "tutors" | "students")}>
          <option value="tutors">Find Tutors</option>
          <option value="students">Find Students</option>
        </select>
        <input className="field" placeholder="City" value={city} onChange={(event) => setCity(event.target.value)} />
        <input className="field" placeholder="Subject" value={subject} onChange={(event) => setSubject(event.target.value)} />
        <Button className="gap-2" type="submit">
          <Search size={16} />
          Search
        </Button>
      </form>
    </section>
  );
}

