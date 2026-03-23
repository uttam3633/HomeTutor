import { AuthCard } from "../features/auth/AuthCard";

export function LoginPage() {
  return (
    <section className="section-shell py-16">
      <AuthCard mode="login" />
    </section>
  );
}

