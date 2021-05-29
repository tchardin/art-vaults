import { useState, useCallback } from "react";

type HoverHandlers = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export default function useHover(disabled: boolean): [boolean, HoverHandlers] {
  const [isHovered, setHover] = useState(false);
  const handleMouseEnter = useCallback(() => {
    setHover(true);
  }, []);
  const handleMouseLeave = useCallback(() => {
    setHover(false);
  }, []);
  return [
    isHovered && !disabled,
    {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  ];
}
