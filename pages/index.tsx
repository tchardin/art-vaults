import { useState, useLayoutEffect, useMemo, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";
import styles from "../styles/Home.module.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import Button from "../components/Button";
import VaultIcon from "../components/VaultIcon";
import { useWeb3 } from "../components/Web3Provider";
import { ROOT, txtFetcher } from "../lib/fetchers";
import GalleryItem from "../components/GalleryItem";
import useAddress from "../components/useAddress";

const formatAddress = (addr: string): string => {
  if (!addr) {
    return "";
  }
  if (addr.length > 20) {
    return addr.slice(0, 20) + "...";
  }
  return addr;
};

export default function Home() {
  const router = useRouter();
  const vaultCID = router.query.v;
  const [isOpen, setWalletOpen] = useState(false);
  const web3 = useWeb3();
  const connectWallet = async () => {
    try {
      await web3.connect();
      if (!vaultCID) {
        newVault();
      }
    } catch (e) {
      console.log(e);
    }
  };
  const startWallet = () => {
    setWalletOpen(true);
  };
  const newVault = () => {
    setWalletOpen(false);
    router.push("/vault");
  };
  useLayoutEffect(() => {
    document.body.dataset.theme = "light";
  }, []);

  const isShareLink = !!vaultCID && !web3.connected;

  const { data: creator } = useSWR<string>(
    isShareLink ? vaultCID + "/username" : null,
    txtFetcher
  );
  const { data: preview } = useSWR<string>(
    isShareLink ? vaultCID + "/preview" : null,
    txtFetcher
  );

  const sharer = useAddress(creator ?? "");

  useEffect(() => {
    if (vaultCID) {
      if (web3.connected) {
        router.push("/vault/" + vaultCID);
      }
    }
  }, [web3.connected, vaultCID]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Vaults.art</title>
        <meta name="description" content="Vaults for digital art." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav
        title="Vaults.art"
        actionTitle="Connect Wallet"
        action={startWallet}
      />

      <main className={styles.main}>
        <Image src="/painting.jpg" height={324} width={700} alt="Painting" />
        <h1 className={styles.title}>
          Decentralized Storage for exclusive NFT content.{" "}
        </h1>

        <Button text="Create Vault" onClick={newVault} />

        <div className={styles.grid}>
          <div className={styles.card} onClick={newVault}>
            <h2>⬆️ Upload your artwork</h2>
            <p>Securely store all assets for a digital artwork in a vault.</p>
          </div>

          <div className={styles.card} onClick={newVault}>
            <h2>🗝 Secure your Vault</h2>
            <p>
              Freeze your art piece, upload the assets to Filecoin and register
              it as an NFT on the Ethereum blockchain.
            </p>
          </div>

          <div className={styles.card} onClick={newVault}>
            <h2>👀 Invite Viewers</h2>
            <p>Whitelist Ethereum accounts to get access to view your vault.</p>
          </div>

          <div className={styles.card} onClick={newVault}>
            <h2>💰 Sell your vault </h2>
            <p>Distribute and sell your vault on NFT platforms.</p>
          </div>
        </div>
      </main>

      <Modal
        actionTitle="Connect Wallet"
        action={connectWallet}
        onDismiss={() => router.push("/")}
        isOpen={isShareLink}
        center
      >
        <GalleryItem
          item={{ name: preview ?? "*" }}
          rootURL={ROOT + "/" + vaultCID}
          noPreview={!preview || preview === "*"}
          selectable={false}
          deletable={false}
          onSelect={() => {}}
        />
        <h2>{sharer} shared a vault with you</h2>
        <p>
          This vault contains exclusive content. Connect your wallet to view its
          contents.
        </p>
      </Modal>

      <Modal
        actionTitle="Connect Wallet"
        action={connectWallet}
        onDismiss={() => setWalletOpen(false)}
        isOpen={isOpen}
        center
      >
        <Image src="/chest.png" height={118} width={200} alt="Chest" />
        <h2>Create Vault</h2>
        <p>
          The best place to store your NFT and associated exclusive content. To
          create a vault, connect your wallet using metamask.
        </p>
      </Modal>

      <Footer />
    </div>
  );
}
