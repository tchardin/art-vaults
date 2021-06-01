import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.container}>
      <div className={styles.content}>
        <p className={styles.disclaimer}>
          This app is experimental, please use at your own risk.
        </p>

        <ul>
          <li>
            <a href="mailto:hello@vaults.art">Contact</a>
          </li>
          <li>
            <a href="https://github.com/tchardin/art-vaults">Github</a>
          </li>
          <li>
            <a href="https://twitter.com/artvaults">Twitter</a>
          </li>
          <li>
            <a href="https://simpleanalytics.com/vaults.art">Analytics</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
