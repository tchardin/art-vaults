import { useCallback, useState, useMemo, useEffect, useRef } from "react";
import styles from "./Vault.module.css";
import Head from "next/head";
import Nav from "../components/Nav";
import PlusIcon from "../components/PlusIcon";
import Modal from "../components/Modal";
import { useDropzone } from "react-dropzone";
import useMeasure from "react-use-measure";
import { useTransition, a } from "@react-spring/web";
import Pill from "../components/Pill";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { useWeb3 } from "../components/Web3Provider";

type Tile = {
  url: string;
};

const placeholders = [
  { url: "https://images.pexels.com/photos/416430/pexels-photo-416430.jpeg" },
  { url: "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg" },
  { url: "https://images.pexels.com/photos/911738/pexels-photo-911738.jpeg" },
  { url: "https://images.pexels.com/photos/358574/pexels-photo-358574.jpeg" },
  { url: "https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg" },
  { url: "https://images.pexels.com/photos/96381/pexels-photo-96381.jpeg" },
  { url: "https://images.pexels.com/photos/1005644/pexels-photo-1005644.jpeg" },
  { url: "https://images.pexels.com/photos/227675/pexels-photo-227675.jpeg" },
  { url: "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg" },
  { url: "https://images.pexels.com/photos/327482/pexels-photo-327482.jpeg" },
  { url: "https://images.pexels.com/photos/2736834/pexels-photo-2736834.jpeg" },
  { url: "https://images.pexels.com/photos/249074/pexels-photo-249074.jpeg" },
  { url: "https://images.pexels.com/photos/310452/pexels-photo-310452.jpeg" },
  { url: "https://images.pexels.com/photos/380337/pexels-photo-380337.jpeg" },
];

const height = 600;

type ModalState =
  | "submit"
  | "success"
  | "share"
  | "closed"
  | "shared"
  | "manage_access";

const modals: { [key: string]: ModalState } = {
  CLOSED: "closed",
  SUBMIT: "submit",
  SUCCESS: "success",
  SHARE: "share",
  SHARED: "shared",
  MANAGE_ACCESS: "manage_access",
};

const modalBtnText = (state: ModalState): string => {
  switch (state) {
    case modals.SUBMIT:
      return "Secure Vault";
    case modals.SUCCESS:
      return "Share Vault";
    case modals.SHARE:
      return "Share";
    case modals.MANAGE_ACCESS:
      return "Done";
    default:
      return "Continue";
  }
};

export default function Vault() {
  const [secured, setSecured] = useState(false);
  const [modal, setModal] = useState<ModalState>(modals.CLOSED);
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const addrInput = useRef() as React.MutableRefObject<HTMLInputElement>;
  const web3 = useWeb3();

  const [addr, setAddr] = useState("");

  const submitVault = () => {
    setModal(modals.SUBMIT);
  };
  const secureVault = () => {
    setModal(modals.SUCCESS);
    setSecured(true);
    document.body.dataset.theme = "blue";
  };
  const sharedVault = () => {
    setModal(modals.SHARED);
    setWhitelist([...whitelist, addr]);
  };
  const shareVault = () => {
    setModal(modals.SHARE);
  };
  const manageAccess = () => {
    setModal(modals.MANAGE_ACCESS);
  };
  const closeModal = () => {
    setModal(modals.CLOSED);
  };
  const pasteAddress = () => {
    if (typeof addrInput.current !== "undefined") {
      navigator.clipboard.readText().then((txt) => setAddr(txt));
      addrInput.current.focus();
    }
  };

  const onDrop = useCallback((files: File[]) => {
    console.log(files);
    set(placeholders);
    /* fetch("http://localhost:2001", { */
    /*   method: "POST", */
    /*   body: files[0], */
    /* }) */
    /*   .then((res) => setCid(res.headers.get("Ipfs-Hash"))) */
    /*   .catch((err) => console.log(err)); */
  }, []);
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
  });

  // Hook1: Tie media queries to the number of columns
  const columns = 3;
  // Hook2: Measure the width of the container element
  const [ref, { width }] = useMeasure();
  // Hook3: Hold items
  const [items, set] = useState<Tile[]>([]);

  // Hook5: Form a grid of stacked items using width & columns we got from hooks 1 & 2
  const [heights, gridItems] = useMemo(() => {
    let heights = new Array(columns).fill(0); // Each column gets a height starting with zero
    let gridItems = items.map((child, i) => {
      const column = heights.indexOf(Math.min(...heights)); // Basic masonry-grid placing, puts tile into the smallest column using Math.min
      const x = (width / columns) * column; // x = container width / number of columns * column index,
      const y = (heights[column] += height / 2) - height / 2; // y = it's just the height of the current column
      return { ...child, x, y, width: width / columns, height: height / 2 };
    });
    return [heights, gridItems];
  }, [columns, items, width]);
  // Hook6: Turn the static grid values into animated transitions, any addition, removal or change will be animated
  const transitions = useTransition(gridItems, {
    key: (item: { css: string; height: number }) => item.css,
    from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  });

  return (
    <div className={styles.container} {...getRootProps()}>
      <Head>
        <title>Vault</title>
        <meta name="description" content="Add content to an open vault." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav
        title="Vaults.art"
        actionTitle={secured ? "Share" : "Submit"}
        action={secured ? shareVault : submitVault}
        actionDisabled={!secured && items.length == 0}
        username={
          web3.account
            ? web3.account.name ?? web3.account.address
            : "unavailable"
        }
      />

      <input {...getInputProps()} />

      {items.length > 0 ? (
        <div className={styles.items}>
          {secured ? (
            whitelist.length > 0 ? (
              <div className={styles.header}>
                <p className={styles.subtitle}>
                  Shared with {whitelist.length} viewers
                </p>
                <Button outline text="Manage Access" onClick={manageAccess} />
              </div>
            ) : null
          ) : (
            <div className={styles.header}>
              <p className={styles.subtitle}>
                Drag and drop to upload your artwork
              </p>
            </div>
          )}
          <div
            ref={ref}
            className={styles.list}
            style={{ height: Math.max(...heights) }}
          >
            {transitions((style, item) => (
              <a.div key={item.url} style={style}>
                <div
                  style={{
                    backgroundImage: `url(${item.url}?auto=compress&dpr=2&h=500&w=500)`,
                  }}
                />
              </a.div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.content}>
          <h1 className={styles.title}>Add Files</h1>
          <p className={[styles.subtitle, styles.bottomGutter].join(" ")}>
            Drag and drop to upload your artwork
          </p>
          <PlusIcon highlight={isDragActive} onClick={open} />
        </div>
      )}

      <Modal
        actionTitle={modalBtnText(modal)}
        action={
          modal == modals.SUBMIT
            ? secureVault
            : modal == modals.SUCCESS
            ? shareVault
            : modal == modals.SHARE
            ? sharedVault
            : closeModal
        }
        onDismiss={closeModal}
        isOpen={modal !== modals.CLOSED}
        center={modal == modals.SHARE}
      >
        {modal == modals.SHARE ? (
          <>
            <h1>Share Vault</h1>
            <p className={styles.modalText}>
              Paste an ethereum address to grant access to view your vault. You
              can revoke access at anytime.
            </p>
            <div className={styles.addrInput}>
              <TextInput
                onChange={(e: React.FormEvent<HTMLInputElement>) =>
                  setAddr(e.currentTarget.value)
                }
                value={addr}
                placeholder="Ethereum Address"
                ref={addrInput}
              />
            </div>
            <Button text="Paste Address" onClick={pasteAddress} secondary />
          </>
        ) : modal == modals.SHARED ? (
          <>
            <h1>Vault Shared!</h1>
            <p>Your vault is now viewable by</p>
            <Pill text="0xajsalkfj3klfj23k3j23kf" />
            <p>Manage access to your vault</p>
            <Button text="Manage Access" onClick={manageAccess} />
          </>
        ) : modal == modals.MANAGE_ACCESS ? (
          <>
            <h1>Manage access</h1>
            <p>Whitelisted addresses</p>
            {whitelist.map((a) => (
              <div className={styles.addrRow} key={a}>
                <Pill text={a} />
                <div
                  className={styles.rmBtn}
                  onClick={() => {
                    const isLast = whitelist.length == 1;
                    setWhitelist(whitelist.filter((aw) => a != aw));
                    if (isLast) {
                      closeModal();
                    }
                  }}
                >
                  Remove
                </div>
              </div>
            ))}
          </>
        ) : secured ? (
          <>
            <h1>Success!</h1>
            <p>
              ✅ Your vault has now been secured. The files are stored immutably
              in Filecoin Storage.
            </p>
            <p>
              You can share vault to permit users to view your work, or sell it
              as an NFT to transfer ownership of the assets.
            </p>
          </>
        ) : (
          <>
            <p className={styles.modalText}>
              Securing your vault will freeze your art piece, upload the assets
              to Filecoin Decentalized storage and register your vault as an NFT
              on the Ethereum Blockchain.
            </p>
            <ul className={styles.detailList}>
              <li>
                <p>🎉 This will be irreversible</p>
              </li>
              <li>
                <p>⛽ 0.0056ETH Network Fee</p>
              </li>
              <li>
                <p>💾 0.0024ETH Storage Fee</p>
              </li>
            </ul>
          </>
        )}
      </Modal>
    </div>
  );
}
