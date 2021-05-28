import styles from "./Vault.module.css";
import Head from "next/head";
import Nav from "../components/Nav";

export default function Vault() {
  const submitVault = () => {};
  return (
    <div className={styles.container}>
      <Head>
        <title>Vault</title>
        <meta name="description" content="Add content to an open vault." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav
        title="Vaults.art"
        actionTitle="Submit"
        action={submitVault}
        username="0xajsalkfj3klfj23k3j23kf"
      />
    </div>
  );
}
