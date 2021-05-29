import { useMemo, memo } from "react";
import useMeasure from "react-use-measure";
import { useTransition, a } from "@react-spring/web";
import styles from "./Gallery.module.css";
import GalleryItem from "./GalleryItem";

export type Tile = {
  url: string;
  name: string;
  fileType: string;
};

type Props = {
  items: Tile[];
  onDelete: (item: Tile) => void;
};

const height = 600;

export default memo(function Gallery({ items, onDelete }: Props) {
  const columns = 3;
  const [ref, { width }] = useMeasure();

  const [heights, gridItems] = useMemo(() => {
    let heights = new Array(columns).fill(0); // Each column gets a height starting with zero
    let gridItems = items.map((child, i) => {
      const column = heights.indexOf(Math.min(...heights)); // Basic masonry-grid placing, puts tile into the smallest column using Math.min
      const x = (width / columns) * column; // x = container width / number of columns * column index,
      const y = (heights[column] += height / 2) - height / 2; // y = it's just the height of the current column
      return { ...child, x, y, width: width / columns, height: height / 2 };
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
      {transitions((style, item: Tile) => (
        <a.div key={item.url} style={style}>
          <GalleryItem
            url={item.url}
            name={item.name}
            fileType={item.fileType}
            onDelete={() => onDelete(item)}
          />
        </a.div>
      ))}
    </div>
  );
});
