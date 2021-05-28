import styles from './Button.module.css'

type Props = {
  text: string;
  onClick: (evt: React.MouseEvent<HTMLElement>) => void;
}

export default function Button({ text, onClick }: Props) {
  return (
    <button className={styles.btn} onClick={onClick}>{text}</button>
  )
}
