import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./Field.module.css";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
};

export function Field({ label, id, value, maxLength, ...rest }: Props) {
  const length = typeof value === "string" ? value.length : 0;
  const showCounter = typeof maxLength === "number";
  const isNear = showCounter && length / maxLength >= 0.9;

  return (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.label}>{label}</span>
      <input
        id={id}
        value={value}
        maxLength={maxLength}
        data-lpignore="true"
        data-form-type="other"
        data-1p-ignore="true"
        {...rest}
        className={styles.input}
      />
      {showCounter && (
        <span
          className={`${styles.counter} ${isNear ? styles.counterNear : ""}`}
          aria-hidden="true"
        >
          {length} / {maxLength}
        </span>
      )}
    </label>
  );
}
