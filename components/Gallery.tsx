import { useMemo, memo } from "react";
import useMeasure from "react-use-measure";
import { useTransition, a } from "@react-spring/web";
import { FileWithPath } from "react-dropzone";
import styles from "./Gallery.module.css";
import GalleryItem, { VaultItem } from "./GalleryItem";

type Props = {
  items: VaultItem[];
  rootURL?: string;
  deletable: boolean;
  selectable?: boolean;
  onSelect: (item: VaultItem) => void;
};

export default memo(function Gallery({
  items,
  onSelect,
  deletable,
  selectable,
  rootURL,
}: Props) {
  const columns = 3;
  const [ref, { width }] = useMeasure();

  const [heights, gridItems] = useMemo(() => {
    let heights = new Array(columns).fill(0); // Each column gets a height starting with zero
    let list = items;
    if (selectable) {
      // No preview item at the end
      list = [...items, { name: "*" }];
    }
    let gridItems = list.map((child, i) => {
      const column = heights.indexOf(Math.min(...heights)); // Basic masonry-grid placing, puts tile into the smallest column using Math.min
      // items are squares
      const size = width / columns;
      const x = size * column; // x = container width / number of columns * column index,
      const y = (heights[column] += size) - size; // y = it's just the height of the current column
      return { item: child, x, y, width: width / columns, height: size };
    });
    return [heights, gridItems];
  }, [columns, items, width]);
  // Hook6: Turn the static grid values into animated transitions, any addition, removal or change will be animated
  const transitions = useTransition(gridItems, {
    key: (item: { css: string; height: number }) => item.css,
    from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  });

  return (
    <div
      ref={ref}
      className={styles.list}
      style={{ height: Math.max(...heights) }}
    >
      {transitions((style, { item, width }) => (
        <a.div
          key={item.name}
          style={style}
          className={width < 200 ? styles.small : ""}
        >
          <GalleryItem
            item={item}
            noPreview={item.name === "*"}
            onSelect={() => onSelect(item)}
            selectable={selectable || false}
            deletable={deletable}
            rootURL={rootURL}
          />
        </a.div>
      ))}
    </div>
  );
});
