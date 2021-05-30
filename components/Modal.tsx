import { Dialog } from "@reach/dialog";
import Button from "./Button";
import Spinner from "./Spinner";
import styles from "./Modal.module.css";

type Props = {
  loading?: boolean;
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
  loading,
  isOpen,
  center,
  onDismiss,
  children,
  dismissTitle,
  disableAction,
  onlyDismiss,
}: Props) {
  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={onDismiss}
      style={{
        width: 460,
        height: 420,
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
          <button onClick={onDismiss} disabled={loading}>
            {loading ? <Spinner /> : dismissTitle ?? "Cancel"}
          </button>
          {!onlyDismiss && !loading && (
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
