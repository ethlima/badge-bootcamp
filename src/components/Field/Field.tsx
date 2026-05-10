import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./Field.module.css";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
};

export function Field({ label, id, ...rest }: Props) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.label}>{label}</span>
      <input id={id} {...rest} className={styles.input} />
    </label>
  );
}
