const decoder = new TextDecoder("utf-8", { fatal: true });

export default async (blob) => {
  const buffer = await blob.arrayBuffer();
  try {
    decoder.decode(buffer);
  } catch (e) {
    if (e instanceof TypeError) return false;
    else throw e;
  }
  return true;
};
