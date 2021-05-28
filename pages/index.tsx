import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Art Vaults</title>
        <meta name="description" content="Vaults for digital art." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Art Vaults
        </h1>

        <p className={styles.description}>
          Get started by adding a vault
        </p>

        <div className={styles.grid}>
          <a href="#" className={styles.card}>
            <h2>Upload your art work &rarr;</h2>
            <p>Store all assets for a digital artwork in a vault.</p>
          </a>

          <a href="#" className={styles.card}>
            <h2>Secure your vault &rarr;</h2>
            <p>Freeze your art piece, upload the assets to Filecoin and register it as an NFT on the Ethereum blockchain.</p>
          </a>

          <a
            href="#"
            className={styles.card}
          >
            <h2>Invite viewers &rarr;</h2>
            <p>Whitelist Ethereum accounts to get access to your vault.</p>
          </a>

          <a
            href="#"
            className={styles.card}
          >
            <h2>Sell your vault &rarr;</h2>
            <p>
              Distribute and sell your vault on NFT platforms.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="#"
        >
	  © 2021 Art Vaults
        </a>
      </footer>
    </div>
  )
}
