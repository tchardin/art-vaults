import { useState, useLayoutEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import Nav from "../components/Nav";
import Modal from "../components/Modal";
import Button from "../components/Button";
import VaultIcon from "../components/VaultIcon";

export default function Home() {
  const router = useRouter();
  const [isOpen, setWalletOpen] = useState(false);
  const connectWallet = () => {
    setWalletOpen(true);
  };
  const newVault = () => {
    setWalletOpen(false);
    router.push("/vault");
  };
  useLayoutEffect(() => {
    document.body.dataset.theme = "light";
  }, []);
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
        action={connectWallet}
      />

      <main className={styles.main}>
        <Image src="/vaulta.png" height={266} width={235} alt="Vault" />
        <h1 className={styles.title}>
          Decentralized Storage for exclusive NFT content.{" "}
        </h1>

        <Button text="Create Vault" onClick={connectWallet} />

        <div className={styles.grid}>
          <div className={styles.card} onClick={connectWallet}>
            <h2>⬆️ Upload your artwork</h2>
            <p>Securely store all assets for a digital artwork in a vault.</p>
          </div>

          <div className={styles.card} onClick={connectWallet}>
            <h2>🗝 Secre your Vault</h2>
            <p>
              Freeze your art piece, upload the assets to Filecoin and register
              it as an NFT on the Ethereum blockchain.
            </p>
          </div>

          <div className={styles.card} onClick={connectWallet}>
            <h2>👀 Invite Viewers</h2>
            <p>Whitelist Ethereum accounts to get access to view your vault.</p>
          </div>

          <div className={styles.card} onClick={connectWallet}>
            <h2>💰 Sell your vault </h2>
            <p>Distribute and sell your vault on NFT platforms.</p>
          </div>
        </div>
      </main>

      <Modal
        actionTitle="Connect Wallet"
        action={newVault}
        onDismiss={() => setWalletOpen(false)}
        isOpen={isOpen}
        center
      >
        <VaultIcon />
        <h2>Create Vault</h2>
        <p>
          The best place to store your NFT and associated exclusive content. To
          create a vault, connect your wallet using metamask.
        </p>
      </Modal>

      <footer className={styles.footer}>
        <p>This app is experimental, use at your own risk.</p>
      </footer>
    </div>
  );
}
