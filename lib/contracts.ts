import { providers, Contract, utils } from "ethers";

export async function sendStoragePayment(cid: string): Promise<void> {
  const ethereum: providers.ExternalProvider = (window as any).ethereum;
  const provider = new providers.Web3Provider(ethereum);

  const signer = provider.getSigner();

  // You can also use an ENS name for the contract address
  const daiAddress = "dai.tokens.ethers.eth";

  // The ERC-20 Contract ABI, which is a common contract interface
  // for tokens (this is the Human-Readable ABI format)
  const daiAbi = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",

    // Get the account balance
    "function balanceOf(address) view returns (uint)",

    // Send some of your tokens to someone else
    "function transfer(address to, uint amount)",

    // An event triggered whenever anyone transfers to someone else
    "event Transfer(address indexed from, address indexed to, uint amount)",
  ];

  // The Contract object
  const daiContract = new Contract(daiAddress, daiAbi, provider);

  // The DAI Contract is currently connected to the Provider,
  // which is read-only. You need to connect to a Signer, so
  // that you can pay to send state-changing transactions.
  const daiWithSigner = daiContract.connect(signer);

  // Each DAI has 18 decimal places
  const dai = utils.parseUnits("1.0", 18);

  // Send 1 DAI to "ricmoo.firefly.eth"
  const tx = daiWithSigner.transfer("ricmoo.firefly.eth", dai);

  // etc
}
