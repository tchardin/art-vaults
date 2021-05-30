export const ROOT = process.env.NEXT_PUBLIC_MYEL_NODE ?? "";

export const jsonFetcher = (root: string) =>
  fetch(ROOT + "/" + root).then((res) => res.json());

export const txtFetcher = (root: string) =>
  fetch(ROOT + "/" + root).then((res) => res.text());
