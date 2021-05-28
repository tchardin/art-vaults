import Link from "next/link";
import styles from "./Nav.module.css";
import Button from "./Button";

type Props = {
  title: string;
  actionTitle: string;
  action: () => void;
  username?: string;
};

export default function Nav({ title, actionTitle, action, username }: Props) {
  return (
    <nav className={styles.nav}>
      <div className={styles.content}>
        <div className={styles.title}>
          <Link href="/">
            <a>{title}</a>
          </Link>
        </div>
        {!!username && (
          <div className={styles.center}>
            <div className={styles.pill}>{username}</div>
          </div>
        )}
        <div className={styles.action}>
          <Button text={actionTitle} onClick={action} />
        </div>
      </div>
    </nav>
  );
}
