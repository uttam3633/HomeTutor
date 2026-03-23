import { useState } from "react";
import { toast } from "sonner";

import { api } from "../../api/client";
import { Button } from "../../components/shared/Button";

type Props = {
  mode: "login" | "register";
};

export function AuthCard({ mode }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true);
    try {
      if (mode === "register") {
        const response = await api.post("/auth/register", {
          full_name: formData.get("full_name"),
          email: formData.get("email") || null,
          phone: formData.get("phone"),
          password: formData.get("password"),
          role: formData.get("role"),
        });
        localStorage.setItem("guruhome-token", response.data.access_token);
        toast.success("Registration successful");
      } else {
        const response = await api.post("/auth/login", {
          email: formData.get("email") || null,
          phone: formData.get("phone") || null,
          password: formData.get("password"),
        });
        localStorage.setItem("guruhome-token", response.data.access_token);
        toast.success("Login successful");
      }
    } catch {
      toast.error("Request failed. Check API configuration and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel mx-auto max-w-xl space-y-4 p-6 sm:p-8">
      <div>
        <h1 className="font-display text-3xl font-bold">{mode === "login" ? "Welcome back" : "Create your GuruHome account"}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {mode === "login" ? "Use email/password or phone/password." : "Choose your role to access parent, tutor, or admin workflows."}
        </p>
      </div>
      {mode === "register" && <input name="full_name" className="field" placeholder="Full name" required />}
      <input name="email" className="field" placeholder="Email address" type="email" />
      <input name="phone" className="field" placeholder="Mobile number" />
      {mode === "register" && (
        <select name="role" className="field" defaultValue="parent">
          <option value="parent">Parent</option>
          <option value="tutor">Tutor</option>
          <option value="admin">Admin</option>
        </select>
      )}
      <input name="password" className="field" placeholder="Password" type="password" required />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
      </Button>
    </form>
  );
}

