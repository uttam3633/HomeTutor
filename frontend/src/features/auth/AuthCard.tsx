import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { api, getApiErrorMessage } from "../../api/client";
import { Button } from "../../components/shared/Button";
import { useAuth } from "./AuthProvider";
import { getDashboardRoute } from "../../lib/auth";

type Props = {
  mode: "login" | "register";
};

export function AuthCard({ mode }: Props) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const password = String(formData.get("password") || "");

    if (mode === "login" && !email && !phone) {
      toast.error("Enter either email or mobile number");
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        const response = await api.post("/auth/register", {
          full_name: formData.get("full_name"),
          email: email || null,
          phone,
          password,
          role: formData.get("role"),
        });
        const user = await login(response.data);
        toast.success("Registration successful");
        navigate(getDashboardRoute(user.role));
      } else {
        const response = await api.post("/auth/login", {
          email: email || null,
          phone: phone || null,
          password,
        });
        const user = await login(response.data);
        toast.success("Login successful");
        navigate(getDashboardRoute(user.role));
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel mx-auto max-w-xl space-y-4 p-6 sm:p-8">
      <div>
        <h1 className="font-display text-3xl font-bold">{mode === "login" ? "Welcome back" : "Create your GuruHome account"}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {mode === "login" ? "Use email/password or phone/password." : "Choose your role to join as a parent or tutor."}
        </p>
      </div>
      {mode === "register" && <input name="full_name" className="field" placeholder="Full name" required />}
      <input name="email" className="field" placeholder="Email address" type="email" />
      <input name="phone" className="field" placeholder="Mobile number" required={mode === "register"} />
      {mode === "register" && (
        <select name="role" className="field" defaultValue="parent">
          <option value="parent">Parent</option>
          <option value="tutor">Tutor</option>
        </select>
      )}
      <input name="password" className="field" placeholder="Password" type="password" required />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
      </Button>
    </form>
  );
}

