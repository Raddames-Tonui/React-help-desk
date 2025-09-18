export async function encryptData(data, key) {
  if (!key) {
    throw new Error('Key is empty');
  } else if (typeof key !== 'string' || key.length < 32) {
    throw new Error('Invalid encryption key: Must be a string of at least 32 characters');
  }

  try {
    // Convert key to CryptoKey (pad to 32 bytes for AES-256)
    const keyBuffer = new TextEncoder().encode(key.padEnd(32, ' ').slice(0, 32));
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    // Generate a random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encode data
    const dataBuffer = new TextEncoder().encode(data);

    // Encrypt the data
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      dataBuffer
    );

    // Combine IV and encrypted data
    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);

    return arrayBufferToBase64(combined);
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export async function decryptData(encryptedData, key) {
  if (typeof key !== 'string' || key.length < 32) {
    throw new Error('Invalid decryption key: Must be a string of at least 32 characters');
  }

  try {
    const keyBuffer = new TextEncoder().encode(key.padEnd(32, ' ').slice(0, 32));
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const ivAndEncrypted = base64ToArrayBuffer(encryptedData);
    const iv = ivAndEncrypted.slice(0, 12);
    const encrypted = ivAndEncrypted.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encrypted
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

// Base64 helper functions
function arrayBufferToBase64(buffer) {
  const chunks = [];
  const chunkSize = 0x8000; // 32KB chunks

  for (let i = 0; i < buffer.length; i += chunkSize) {
    const chunk = buffer.subarray(i, i + chunkSize);
    chunks.push(String.fromCharCode.apply(null, Array.from(chunk)));
  }

  return btoa(chunks.join(''));
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}
