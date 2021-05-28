import Link from "next/link";
import styles from "./Nav.module.css";
import Button from "./Button";
import Pill from "./Pill";

type Props = {
  title: string;
  actionTitle: string;
  action: () => void;
  actionDisabled?: boolean;
  username?: string;
};

export default function Nav({
  title,
  actionTitle,
  action,
  username,
  actionDisabled,
}: Props) {
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
            <Pill text={username} />
          </div>
        )}
        <div className={styles.action}>
          <Button
            text={actionTitle}
            onClick={action}
            disabled={actionDisabled}
          />
        </div>
      </div>
    </nav>
  );
}
