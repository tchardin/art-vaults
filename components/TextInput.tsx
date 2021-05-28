import styles from "./TextInput.module.css";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function TextInput({ ...rest }) {
  return <input {...rest} className={styles.container} />;
}
