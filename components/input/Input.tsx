import React from "react";
import styles from "./button-styles.module.scss";

export default function Button({
  onChange,
  ref,
  placeholder,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.RefObject<HTMLInputElement>;
  placeholder: string;
}) {
  return (
    <input
      className={styles.input}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}
