import { ethers, providers } from "ethers";
import { createContext, useState, useContext } from "react";

type Account = {
  address: string;
  name?: string;
};

type ENSCache = {
  timestamp: number;
  name: string;
};

type Web3 = {
  provider?: providers.Web3Provider;
  ethereum?: providers.ExternalProvider;
  account?: Account;
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
    console.log("connecting...");
    const ethereum: providers.ExternalProvider = (window as any).ethereum;
    if (typeof ethereum != "undefined") {
      const accounts = await ethereum.request?.({
        method: "eth_requestAccounts",
      });
      if (accounts.length == 0) {
        console.error("no account available");
        return;
      }
      const provider = new providers.Web3Provider(ethereum);
      const defaultAcc: Account = {
        address: accounts[0],
      };

      const cachedVal = window.localStorage.getItem("ensCache_" + accounts[0]);
      if (cachedVal) {
        const cachedName: ENSCache = JSON.parse(cachedVal);
        if (cachedName.timestamp > Date.now()) {
          defaultAcc.name = cachedName.name;
          setProvider({
            provider,
            ethereum,
            account: defaultAcc,
          });
          return;
        }
      }

      // Check if we can find an ENS name associated with this account
      try {
        const reportedName = await provider.lookupAddress(accounts[0]);
        const resolvedAddress = await provider.resolveName(reportedName);
        if (
          ethers.utils.getAddress(accounts[0]) ===
          ethers.utils.getAddress(resolvedAddress)
        ) {
          defaultAcc.address = reportedName;
        }
        // cache the ENS name to avoid querying the RPC too much
        window.localStorage.setItem(
          "ensCache_" + accounts[0],
          JSON.stringify({
            timestamp: Date.now() + 360000,
            name: reportedName,
          })
        );
      } catch (e) {
        console.log(e);
      }

      setProvider({
        provider,
        ethereum,
        account: defaultAcc,
      });
    } else {
      console.log("Metamask unavailable");
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
