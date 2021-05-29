import { Dialog } from "@reach/dialog";
import Button from "./Button";
import styles from "./Modal.module.css";

type Props = {
  isOpen: boolean;
  actionTitle: string;
  action: () => void;
  onDismiss: () => void;
  dismissTitle?: string;
  children: React.ReactNode;
  center?: boolean;
  disableAction?: boolean;
  onlyDismiss?: boolean;
};

export default function Modal({
  actionTitle,
  action,
  isOpen,
  center,
  onDismiss,
  children,
  dismissTitle,
  disableAction,
  onlyDismiss,
}: Props) {
  console.log(onlyDismiss);
  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={onDismiss}
      style={{
        width: 460,
        height: 409,
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "#0013BD",
        borderStyle: "solid",
        marginTop: "25vh",
        position: "relative",
      }}
      aria-label={actionTitle}
    >
      <div className={styles.container}>
        <div
          className={[styles.content, center ? styles.center : ""].join(" ")}
        >
          {children}
        </div>
        <div className={styles.bottomBar}>
          <button onClick={onDismiss}>{dismissTitle ?? "Cancel"}</button>
          {!onlyDismiss && (
            <>
              <div className={styles.divider} />
              <button
                onClick={action}
                className={[
                  styles.primary,
                  disableAction ? styles.disabled : "",
                ].join(" ")}
                disabled={disableAction}
              >
                {actionTitle}
              </button>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
}
