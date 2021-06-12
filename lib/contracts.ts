import { providers, Contract, utils } from "ethers";

export async function sendStoragePayment(cid: string): Promise<void> {
  const ethereum: providers.ExternalProvider = (window as any).ethereum;
  const provider = new providers.Web3Provider(ethereum);

  const signer = provider.getSigner();

  const contract = "0x151eF14b490B14c2Fd7F2716D734E55df3434920";

  // The ERC-20 Contract ABI, which is a common contract interface
  // for tokens (this is the Human-Readable ABI format)
  const myelAbi = [
    // Pay storage fee and mint and NFT
    "function payStorageFeeMint(string memory cid) payable",

    // An event triggered whenever anyone transfers to someone else
    "event LogDeposit(address sender, uint amount, string cid)"
  ];

  // The Contract object
  const myelContract = new Contract(contract, myelAbi, provider);

  // The MYEL Contract is currently connected to the Provider,
  // which is read-only. You need to connect to a Signer, so
  // that you can pay to send state-changing transactions.
  const myelWithSigner = myelContract.connect(signer);

  // Send 1 DAI to "ricmoo.firefly.eth"
  const tx = myelWithSigner.payStorageFeeMint(cid, {
    value: utils.parseEther("0.1")
});

  // etc
}
