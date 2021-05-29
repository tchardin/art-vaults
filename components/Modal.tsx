import { Dialog } from "@reach/dialog";
import Button from "./Button";
import styles from "./Modal.module.css";

type Props = {
  isOpen: boolean;
  actionTitle: string;
  action: () => void;
  onDismiss: () => void;
  children: React.ReactNode;
  center?: boolean;
};

export default function Modal({
  actionTitle,
  action,
  isOpen,
  center,
  onDismiss,
  children,
}: Props) {
  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={onDismiss}
      style={{
        width: 460,
        height: 409,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: "#0013BD",
        borderStyle: "solid",
        marginTop: "25vh",
      }}
      aria-label={actionTitle}
    >
      <div className={styles.container}>
        <div
          className={[styles.content, center ? styles.center : ""].join(" ")}
        >
          {children}
        </div>
        <div className={styles.action}>
          <Button text={actionTitle} onClick={action} wide />
        </div>
      </div>
    </Dialog>
  );
}
