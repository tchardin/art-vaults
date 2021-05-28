import styles from "./Button.module.css";

type Props = {
  text: string;
  wide?: boolean;
  onClick: (evt: React.MouseEvent<HTMLElement>) => void;
};

export default function Button({ text, onClick, wide }: Props) {
  return (
    <button
      className={[styles.btn, wide ? styles.wide : ""].join(" ")}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
