import styles from "./PlusIcon.module.css";

type Props = {
  highlight?: boolean;
  onClick?: () => void;
};
export default function PlusIcon({ highlight, onClick }: Props) {
  return (
    <svg
      width="143"
      height="147"
      viewBox="0 0 143 147"
      fill="none"
      onClick={onClick}
    >
      <path
        xmlns="http://www.w3.org/2000/svg"
        opacity={highlight ? "1" : "0.1"}
        d="M0.254688 59.3V87.8H56.6547V146.9H86.3547V87.8H142.755V59.3H86.3547V0.799988H56.6547V59.3H0.254688Z"
        fill={highlight ? "#0013BD" : "black"}
        className={styles.content}
      />
    </svg>
  );
}
