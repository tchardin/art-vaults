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

      <Nav title="Address" actionTitle="Submit" action={submitVault} />
    </div>
  );
}
