import { forwardRef, useRef } from "react";
import styles from "./TextInput.module.css";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export default forwardRef<HTMLInputElement, Props>(function TextInput(
  { ...rest },
  ref
) {
  return <input {...rest} className={styles.container} ref={ref} />;
});
