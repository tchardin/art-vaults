import styles from "./Pill.module.css";

type Props = {
  text: string;
};
export default function Pill({ text }: Props) {
  return <div className={styles.pill}>{text}</div>;
}
