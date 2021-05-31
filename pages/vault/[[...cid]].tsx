import {
  useCallback,
  useState,
  useMemo,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import styles from "./Vault.module.css";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import Nav from "../../components/Nav";
import PlusIcon from "../../components/PlusIcon";
import Modal from "../../components/Modal";
import { useDropzone, FileWithPath } from "react-dropzone";
import Pill from "../../components/Pill";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import { useWeb3 } from "../../components/Web3Provider";
import Gallery from "../../components/Gallery";
import GalleryItem, { VaultItem } from "../../components/GalleryItem";
import { ROOT, jsonFetcher, txtFetcher } from "../../lib/fetchers";

type ModalState =
  | "submit"
  | "success"
  | "share"
  | "closed"
  | "shared"
  | "manage_access"
  | "processing"
  | "error"
  | "select_preview"
  | "confirm_preview";

const modals: { [key: string]: ModalState } = {
  CLOSED: "closed",
  SUBMIT: "submit",
  SUCCESS: "success",
  SHARE: "share",
  SHARED: "shared",
  MANAGE_ACCESS: "manage_access",
  PROCESSING: "processing",
  ERROR: "error",
  SELECT_PREVIEW: "select_preview",
  CONFIRM_PREVIEW: "confirm_preview",
};

const modalBtnText = (state: ModalState): string => {
  switch (state) {
    case modals.CONFIRM_PREVIEW:
      return "Secure Vault";
    case modals.ERROR:
      return "Try again";
    case modals.SUBMIT:
      return "Continue";
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

const modalDismissText = (state: ModalState): string => {
  switch (state) {
    case modals.SUCCESS:
      return "Dismiss";
    case modals.SHARED:
      return "Continue";
    case modals.MANAGE_ACCESS:
      return "Done";
    default:
      return "Cancel";
  }
};

const nonFileItems: { [key: string]: boolean } = {
  username: true,
  preview: true,
  "": true,
};

type UserCache = {
  root: string;
  whitelist: string[];
};

const setLocalUser = (addr: string, root: string, whitelist: string[]) => {
  window.localStorage.setItem(
    "vaultRoot_" + addr,
    JSON.stringify({
      root,
      whitelist,
    })
  );
};

const getLocalUser = (addr: string): UserCache | null => {
  const cached = window.localStorage.getItem("vaultRoot_" + addr);
  if (!cached) {
    return null;
  }
  return JSON.parse(cached);
};

export default function Vault() {
  const [modal, setModal] = useState<ModalState>(modals.CLOSED);
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const addrInput = useRef() as React.MutableRefObject<HTMLInputElement>;
  const web3 = useWeb3();

  const [addr, setAddr] = useState("");
  const [preview, setPreview] = useState<VaultItem>();
  const {
    push,
    replace,
    query: { cid: root },
  } = useRouter();

  const [secured, setSecured] = useState(false);

  const { data, error } = useSWR<string[]>(root?.[0] ?? null, jsonFetcher);
  const [items, set] = useState<VaultItem[]>([]);
  const [err, setErr] = useState<string>();

  const { data: creator } = useSWR<string>(
    root?.[0] ? root[0] + "/username" : null,
    txtFetcher
  );

  const isOwner = useMemo(
    () => !!creator && creator == web3.account?.address,
    [creator, web3.account?.address]
  );

  // set initial whitelist from cache
  useEffect(() => {
    if (web3.account?.address) {
      const user = getLocalUser(web3.account.address);
      if (!user) {
        return;
      }
      if (user.root) {
        replace("/vault/" + user.root);
      }
      if (user.whitelist.length) {
        setWhitelist(user.whitelist);
      }
    }
  }, [web3.account?.address]);

  // Subscribe to cache the whitelist
  useEffect(() => {
    if (root?.[0] && web3.account?.address) {
      setLocalUser(web3.account.address, root[0], whitelist);
    }
  }, [whitelist]);

  useEffect(() => {
    if (web3.connected && !web3.account) {
      replace("/");
    }
    if (root?.[0]) {
      setSecured(true);
    }
  }, [root?.[0], web3.account]);

  // If the vault is secured, the item keys are loaded from the API
  // else they are in the local state
  const vaultItems = useMemo(
    () =>
      secured
        ? data
            ?.filter((key) => !nonFileItems[key])
            .map((key) => ({ name: key })) || []
        : items,
    [data, secured, items]
  );

  useLayoutEffect(() => {
    if (isOwner) {
      document.body.dataset.theme = "blue";
    }
  }, [isOwner]);

  const submitVault = () => {
    setModal(modals.SUBMIT);
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
  const selectPreview = () => {
    setModal(modals.SELECT_PREVIEW);
  };
  const confirmPreview = () => {
    setModal(modals.CONFIRM_PREVIEW);
  };
  const closeModal = () => {
    setAddr("");
    setModal(modals.CLOSED);
  };
  const pasteAddress = () => {
    if (typeof addrInput.current !== "undefined") {
      navigator.clipboard.readText().then((txt) => setAddr(txt));
      addrInput.current.focus();
    }
  };

  const upload = async (items: File[]): Promise<string> => {
    if (!ROOT || !web3.account?.address) {
      return "";
    }
    const body = new FormData();
    // Set the user account
    body.append("username", web3.account?.address);
    body.append("preview", preview?.name ?? "*");
    items.forEach((item) => body.append("file", item, item.name));

    const response = await fetch(ROOT, {
      method: "POST",
      body,
    });
    const rootCID = response.headers.get("Ipfs-Hash");
    if (!rootCID) {
      return "";
    }
    return rootCID;
  };

  const secureVault = async () => {
    setModal(modals.PROCESSING);
    // artificial delay for now
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const files: File[] = [];
    items.forEach((item) => item.file && files.push(item.file));
    try {
      const root = await upload(files);
      if (root) {
        push("/vault/" + root);
        setModal(modals.SUCCESS);
        setSecured(true);
        if (web3.account?.address) {
          setLocalUser(web3.account?.address, root, []);
        }
      } else {
        setErr("fail to upload");
        setModal(modals.ERROR);
      }
    } catch (e) {
      setErr(e.toString());
      setModal(modals.ERROR);
    }
  };

  const onDrop = useCallback(
    (files: FileWithPath[]) => {
      set([...items, { name: files[0].name, file: files[0] }]);
    },
    [items]
  );
  const handleDelete = useCallback(
    (item: VaultItem) => {
      set(items.filter((el) => el.name != item.name));
    },
    [items]
  );
  const handleSelect = useCallback((item: VaultItem) => {
    setPreview(item);
    setModal(modals.CONFIRM_PREVIEW);
  }, []);
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
  });
  const shareLink = "vaults.art/?v=" + root;
  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  return (
    <div className={styles.container} {...getRootProps()}>
      <Head>
        <title>Vault</title>
        <meta name="description" content="Add content to an open vault." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav
        title="Vaults.art"
        actionTitle={
          secured && !isOwner ? "Bid on Vault" : secured ? "Share" : "Submit"
        }
        action={secured ? shareVault : selectPreview}
        actionDisabled={
          (secured && !isOwner) || (!secured && items.length == 0)
        }
        username={
          web3.account
            ? web3.account.name ?? web3.account.address
            : "unavailable"
        }
      />

      <input {...getInputProps()} />

      {vaultItems.length > 0 ? (
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
          <Gallery
            items={vaultItems}
            onSelect={handleDelete}
            deletable={!secured}
            rootURL={secured ? ROOT + "/" + root?.[0] : undefined}
          />
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
        dismissTitle={modalDismissText(modal)}
        action={
          modal === modals.SUBMIT
            ? secureVault
            : modal === modals.CONFIRM_PREVIEW
            ? submitVault
            : modal === modals.SUCCESS
            ? shareVault
            : modal === modals.SHARE
            ? sharedVault
            : modal === modals.ERROR
            ? submitVault
            : closeModal
        }
        onDismiss={closeModal}
        isOpen={modal !== modals.CLOSED}
        loading={modal === modals.PROCESSING}
        center={modal === modals.SHARE || modal === modals.CONFIRM_PREVIEW}
        disableAction={modal == modals.SHARE && addr === ""}
        onlyDismiss={
          modal === modals.SHARED ||
          modal === modals.MANAGE_ACCESS ||
          modal === modals.SELECT_PREVIEW
        }
      >
        {modal === modals.SHARE ? (
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
        ) : modal === modals.SHARED ? (
          <>
            <h1>Vault Shared!</h1>
            <div className={styles.labelRow}>
              <p>Your vault is now viewable by</p>
              <Pill text={addr} />
            </div>
            <div className={styles.labelRow}>
              <p>Manage access to your vault</p>
              <Button text="Manage Access" onClick={manageAccess} />
            </div>
            <div className={styles.labelRow}>
              <p>Share this link to let them know they have access</p>
              <div className={styles.addrRow}>
                <div className={styles.link} onClick={copyLink}>
                  {shareLink.slice(0, 24)}...
                </div>
                <Button text="Copy" onClick={copyLink} secondary />
              </div>
            </div>
          </>
        ) : modal === modals.MANAGE_ACCESS ? (
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
        ) : modal === modals.SELECT_PREVIEW ? (
          <>
            <h2>Please select a preview for your Vault</h2>
            <Gallery
              items={vaultItems}
              deletable={false}
              selectable
              onSelect={handleSelect}
            />
          </>
        ) : modal === modals.CONFIRM_PREVIEW ? (
          <>
            <h2>Confirm Preview Selection</h2>
            <div className={styles.selectedPreview}>
              <GalleryItem
                item={preview as VaultItem}
                noPreview={preview?.name === "*"}
                selectable={false}
                deletable={false}
                onSelect={() => {}}
              />
            </div>
            <Button text="Edit Cover" onClick={selectPreview} secondary />
          </>
        ) : modal === modals.PROCESSING ? (
          <>
            <h1>Processing...</h1>
            <p>Your vault is being uploaded onto Filecoin Storage.</p>
            <p>
              This can take a couple minutes as it involves submitting a
              transaction on the blockchain.
            </p>
          </>
        ) : modal === modals.ERROR ? (
          <>
            <h1>Oh no!</h1>
            <p className={styles.errMsg}>{err}</p>
            <p>
              This could be due to your network fee not being high enough or
              congestion on our network. Please try again!
            </p>
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
