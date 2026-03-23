import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { UserRole } from "../../lib/auth";
import { useAuth } from "./AuthProvider";

type Props = {
  children: ReactNode;
  role?: UserRole;
};

export function RequireAuth({ children, role }: Props) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <section className="section-shell py-14">
        <div className="glass-panel p-8">
          <p className="text-sm text-slate-600 dark:text-slate-300">Loading your dashboard...</p>
        </div>
      </section>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

