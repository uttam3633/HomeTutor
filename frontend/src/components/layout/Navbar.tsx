import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";

import { ThemeToggle } from "../shared/ThemeToggle";
import { Button } from "../shared/Button";

const links = [
  { to: "/", label: "Home" },
  { to: "/find-tutor", label: "Find Tutor" },
  { to: "/find-students", label: "Find Students" },
  { to: "/pricing", label: "Pricing" },
  { to: "/reviews", label: "Reviews" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-cream/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="section-shell flex h-20 items-center justify-between gap-4">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight">
          Guru<span className="text-orange-500">Home</span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${isActive ? "text-orange-500" : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login" className="hidden sm:block">
            <Button variant="secondary">Login</Button>
          </Link>
          <Link to="/register" className="hidden sm:block">
            <Button>Join Now</Button>
          </Link>
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 lg:hidden dark:border-slate-700">
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

