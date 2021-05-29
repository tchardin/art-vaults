import { useMemo } from "react";
import { FileWithPath } from "react-dropzone";
import styles from "./GalleryItem.module.css";
import useHover from "./useHover";
import Button from "./Button";

type Props = {
  item: FileWithPath;
  deletable: boolean;
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

export default function GalleryItem({ item, onDelete, deletable }: Props) {
  const url = useMemo(() => URL.createObjectURL(item), [item]);
  const [hovered, handlers] = useHover(!deletable);
  const btn = (
    <div className={styles.delete}>
      <Button text="Delete" onClick={onDelete} destroy />
    </div>
  );
  return supportsPreview[item.type] ? (
    <div
      className={styles.item}
      style={{ backgroundImage: `url(${url})` }}
      role="img"
      aria-label={item.name}
      {...handlers}
    >
      {hovered && btn}
    </div>
  ) : (
    <div className={[styles.item, styles.placeholder].join(" ")} {...handlers}>
      <span className={styles.type}>{imgName(item.type)}</span>
      {hovered && btn}
    </div>
  );
}
