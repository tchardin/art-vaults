import { ethers, providers } from "ethers";
import { createContext, useState, useContext, useEffect } from "react";

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
  connected: boolean;
  connect: () => Promise<void>;
};

const Web3Context = createContext<Web3API>({
  connect: () => Promise.resolve(),
  connected: false,
});

type Web3ProviderProps = {
  children: React.ReactNode;
};

export const mainnetInfura = new providers.StaticJsonRpcProvider(
  process.env.NEXT_PUBLIC_INFURA_HTTP
);

export const getENSOrAddress = async (addr: string): Promise<string> => {
  let name = addr;
  const cachedVal = window.localStorage.getItem("ensCache_" + addr);
  if (cachedVal) {
    const cachedName: ENSCache = JSON.parse(cachedVal);
    if (cachedName.timestamp > Date.now()) {
      return cachedName.name;
    }
  }

  // Check if we can find an ENS name associated with this account
  try {
    const reportedName = await mainnetInfura.lookupAddress(addr);
    const resolvedAddress = await mainnetInfura.resolveName(reportedName);
    if (
      ethers.utils.getAddress(addr) === ethers.utils.getAddress(resolvedAddress)
    ) {
      name = reportedName;
    }
    // cache the ENS name to avoid querying the RPC too much
    window.localStorage.setItem(
      "ensCache_" + addr,
      JSON.stringify({
        timestamp: Date.now() + 360000,
        name: reportedName,
      })
    );
  } catch (e) {
    console.log("getENSOrAddress", e, addr);
  }
  return name;
};

export default function Web3Provider({ children }: Web3ProviderProps) {
  const [provider, setProvider] = useState<Web3 | null>(null);

  const setupProvider = async (
    account: string,
    ethereum: providers.ExternalProvider
  ) => {
    const provider = new providers.Web3Provider(ethereum);
    const defaultAcc: Account = {
      address: account,
    };

    const name = await getENSOrAddress(account);
    if (name !== account) {
      defaultAcc.name = name;
    }

    setProvider({
      provider,
      ethereum,
      account: defaultAcc,
    });
  };

  const connect = async () => {
    console.log("connecting...");
    const ethereum: providers.ExternalProvider = (window as any).ethereum;
    if (typeof ethereum != "undefined") {
      const accounts = await ethereum.request?.({
        method: "eth_requestAccounts",
      });
      if (accounts.length === 0) {
        console.error("no account available");
        return;
      }
      setupProvider(accounts[0], ethereum);
    } else {
      console.log("Metamask unavailable");
    }
  };

  const start = async () => {
    const ethereum: providers.ExternalProvider = (window as any).ethereum;
    if (typeof ethereum != "undefined") {
      const accounts = await ethereum.request?.({
        method: "eth_accounts",
      });
      if (accounts.length === 0) {
        console.log("Metamask not connected");
        return;
      }
      setupProvider(accounts[0], ethereum);
    }
  };

  useEffect(() => {
    start();
  }, []);

  return (
    <Web3Context.Provider
      value={{ ...provider, connect, connected: !!provider }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => {
  return useContext(Web3Context);
};
