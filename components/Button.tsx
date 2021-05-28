import styles from "./Button.module.css";

type Props = {
  text: string;
  wide?: boolean;
  outline?: boolean;
  disabled?: boolean;
  onClick: (evt: React.MouseEvent<HTMLElement>) => void;
};

export default function Button({
  text,
  onClick,
  wide,
  outline,
  disabled,
}: Props) {
  return (
    <button
      className={[
        styles.btn,
        wide ? styles.wide : "",
        outline ? styles.outline : "",
        disabled ? styles.disabled : "",
      ].join(" ")}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
