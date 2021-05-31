import { useState, useEffect } from "react";

import { getENSOrAddress } from "./Web3Provider";

export default function useAddress(addr: string): string {
  const [formatted, setFormatted] = useState(addr);

  const format = (raw: string): string => {
    // If ENS domain just return it
    if (/\./.test(raw)) {
      return raw;
    }
    if (raw.length > 16) {
      return raw.slice(0, 9) + "..." + raw.slice(-4);
    }
    return raw;
  };
  const set = (name: string) => {
    setFormatted(format(name));
  };
  useEffect(() => {
    getENSOrAddress(addr).then(set);
  }, [addr]);

  return formatted;
}
