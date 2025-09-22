// cryptoUtils.ts
export async function encryptData(data: string, key: string): Promise<string> {
  if (!key) throw new Error("Key is empty");
  if (key.length < 32) throw new Error("Key must be at least 32 characters");

  const keyBuffer = new TextEncoder().encode(key.padEnd(32, " ").slice(0, 32));
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const dataBuffer = new TextEncoder().encode(data);

  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, cryptoKey, dataBuffer);

  const encryptedArray = new Uint8Array(encrypted);
  const combined = new Uint8Array(iv.length + encryptedArray.length);
  combined.set(iv);
  combined.set(encryptedArray, iv.length);

  return arrayBufferToBase64(combined);
}

export async function decryptData(encryptedData: string, key: string): Promise<string> {
  if (key.length < 32) throw new Error("Key must be at least 32 characters");

  const keyBuffer = new TextEncoder().encode(key.padEnd(32, " ").slice(0, 32));
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const ivAndEncrypted = base64ToArrayBuffer(encryptedData);
  const iv = ivAndEncrypted.slice(0, 12);
  const encrypted = ivAndEncrypted.slice(12);

  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, cryptoKey, encrypted);
  return new TextDecoder().decode(decrypted);
}

function arrayBufferToBase64(buffer: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < buffer.length; i += chunkSize) {
    const chunk = buffer.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
