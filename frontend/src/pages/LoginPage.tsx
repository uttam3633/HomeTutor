import { AuthCard } from "../features/auth/AuthCard";

export function LoginPage() {
  return (
    <section className="section-shell page-entrance py-16">
      <AuthCard mode="login" />
    </section>
  );
}

