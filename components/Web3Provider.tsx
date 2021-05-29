import { ethers, providers } from "ethers";
import { createContext, useState, useContext } from "react";

type Web3 = {
  provider?: providers.Web3Provider;
  ethereum?: providers.ExternalProvider;
  account?: string;
};

type Web3API = Web3 & {
  connect: () => Promise<void>;
};

const Web3Context = createContext<Web3API>({
  connect: () => Promise.resolve(),
});

type Web3ProviderProps = {
  children: React.ReactNode;
};

export default function Web3Provider({ children }: Web3ProviderProps) {
  const [provider, setProvider] = useState<Web3 | null>(null);

  const connect = async () => {
    try {
      const ethereum: providers.ExternalProvider = (window as any).ethereum;
      if (typeof ethereum != "undefined") {
        const accounts = await ethereum.request?.({
          method: "eth_requestAccounts",
        });
        console.log(accounts);
        setProvider({
          provider: new providers.Web3Provider(ethereum),
          ethereum,
          account: accounts[0],
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Web3Context.Provider value={{ ...provider, connect }}>
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => {
  return useContext(Web3Context);
};
