import styles from "./Button.module.css";

type Props = {
  text: string;
  wide?: boolean;
  outline?: boolean;
  secondary?: boolean;
  disabled?: boolean;
  destroy?: boolean;
  onClick: (evt: React.MouseEvent<HTMLElement>) => void;
};

export default function Button({
  text,
  onClick,
  wide,
  outline,
  disabled,
  secondary,
  destroy,
}: Props) {
  return (
    <button
      className={[
        styles.btn,
        wide ? styles.wide : "",
        outline ? styles.outline : "",
        disabled ? styles.disabled : "",
        secondary ? styles.secondary : "",
        destroy ? styles.destroy : "",
      ].join(" ")}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
