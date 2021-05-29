import styles from "./GalleryItem.module.css";
import useHover from "./useHover";
import Button from "./Button";

type Props = {
  url: string;
  name: string;
  fileType: string;
  onDelete: () => void;
};

const supportsPreview: { [key: string]: boolean } = {
  "image/jpeg": true,
  "image/svg+xml": true,
  "image/png": true,
  "image/gif": true,
};

const imgName = (type: string): string => {
  const segments = type.split("/");
  if (segments.length == 1) {
    return "." + segments[0];
  }
  const name = segments[1];
  if (/\+/.test(name)) {
    return "." + name.split("+")[0];
  }
  return "." + name;
};

export default function GalleryItem({ url, name, fileType, onDelete }: Props) {
  const [hovered, handlers] = useHover(false);
  const btn = (
    <div className={styles.delete}>
      <Button text="Delete" onClick={onDelete} destroy />
    </div>
  );
  return supportsPreview[fileType] ? (
    <div
      className={styles.item}
      style={{ backgroundImage: `url(${url})` }}
      role="img"
      aria-label={name}
      {...handlers}
    >
      {hovered && btn}
    </div>
  ) : (
    <div className={[styles.item, styles.placeholder].join(" ")} {...handlers}>
      <span className={styles.type}>{imgName(fileType)}</span>
      {hovered && btn}
    </div>
  );
  /* <div style={{ backgroundImage: `url(${url})` }} className={styles.item} /> */
}
