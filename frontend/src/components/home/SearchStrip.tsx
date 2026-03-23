import { Search } from "lucide-react";

import { Button } from "../shared/Button";

export function SearchStrip() {
  return (
    <section className="section-shell -mt-10 relative z-10">
      <div className="glass-panel grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-5 lg:p-5">
        <input className="field" placeholder="City" />
        <input className="field" placeholder="Subject" />
        <input className="field" placeholder="Class" />
        <select className="field">
          <option>Mode</option>
          <option>Home</option>
          <option>Online</option>
          <option>Group</option>
          <option>Institute</option>
        </select>
        <Button className="gap-2">
          <Search size={16} />
          Search
        </Button>
      </div>
    </section>
  );
}

