import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "accent" | "secondary" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({ variant = "primary", children, className = "", ...rest }: Props) {
  const cls = [styles.button, styles[variant], className].filter(Boolean).join(" ");
  return (
    <button {...rest} className={cls}>
      {children}
    </button>
  );
}
