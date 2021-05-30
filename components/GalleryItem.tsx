import { useMemo } from "react";
import { FileWithPath } from "react-dropzone";
import styles from "./GalleryItem.module.css";
import useHover from "./useHover";
import Button from "./Button";

export type VaultItem = {
  name: string;
  file?: FileWithPath;
};

type Props = {
  item: VaultItem;
  rootURL?: string;
  deletable: boolean;
  onDelete: () => void;
};

const supportsPreview: { [key: string]: boolean } = {
  "image/jpeg": true,
  jpeg: true,
  JPG: true,
  jpg: true,
  "image/svg+xml": true,
  svg: true,
  "image/png": true,
  png: true,
  "image/gif": true,
  gif: true,
};

const typeFromName = (name: string): string => {
  const segments = name.split(".");
  if (segments.length > 1) {
    return segments[segments.length - 1];
  }
  return "unknown";
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

export default function GalleryItem({
  item,
  onDelete,
  deletable,
  rootURL,
}: Props) {
  const url = useMemo(
    () =>
      item.file ? URL.createObjectURL(item.file) : rootURL + "/" + item.name,
    [item]
  );
  const [hovered, handlers] = useHover(!deletable);
  const btn = (
    <div className={styles.delete}>
      <Button text="Delete" onClick={onDelete} destroy />
    </div>
  );

  const type = item.file ? item.file.type : typeFromName(item.name);

  return supportsPreview[type] ? (
    <div
      className={styles.item}
      style={{ backgroundImage: `url("${url}")` }}
      role="img"
      aria-label={item.name}
      {...handlers}
    >
      {hovered && btn}
    </div>
  ) : (
    <div className={[styles.item, styles.placeholder].join(" ")} {...handlers}>
      <span className={styles.type}>{imgName(type)}</span>
      {hovered && btn}
    </div>
  );
}
