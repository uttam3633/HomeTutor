import { ButtonHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return <button className={cn(variant === "primary" ? "btn-primary" : "btn-secondary", className)} {...props} />;
}

