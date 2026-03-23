import { Outlet } from "react-router-dom";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function AppShell() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

