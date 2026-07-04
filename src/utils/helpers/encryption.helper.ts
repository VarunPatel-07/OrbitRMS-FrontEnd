const ALGORITHM = 'AES-GCM';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

const uint8ArrayToArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
   const buffer = new ArrayBuffer(bytes.byteLength);
   new Uint8Array(buffer).set(bytes);

   return buffer;
};

const getEncryptionKey = async (): Promise<CryptoKey> => {
   const key = import.meta.env.VITE_APP_ENCRYPTION_KEY;

   if (!key) {
      throw new Error('VITE_APP_ENCRYPTION_KEY is not defined');
   }

   const decodedKey = base64ToUint8Array(key);

   if (decodedKey.length !== 32) {
      throw new Error(
         'VITE_APP_ENCRYPTION_KEY must be 32 bytes base64 encoded'
      );
   }

   return window.crypto.subtle.importKey(
      'raw',
      uint8ArrayToArrayBuffer(decodedKey),
      {
         name: ALGORITHM,
      },
      false,
      ['encrypt', 'decrypt']
   );
};

const base64ToUint8Array = (base64: string): Uint8Array => {
   const binaryString = window.atob(base64);
   const bytes = new Uint8Array(binaryString.length);

   for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
   }

   return bytes;
};

const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
   let binaryString = '';

   for (let i = 0; i < bytes.length; i++) {
      binaryString += String.fromCharCode(bytes[i]);
   }

   return window.btoa(binaryString);
};

const base64UrlEncode = (bytes: Uint8Array): string => {
   return uint8ArrayToBase64(bytes)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
};

const base64UrlDecode = (value: string): Uint8Array => {
   let base64 = value.replace(/-/g, '+').replace(/_/g, '/');

   while (base64.length % 4) {
      base64 += '=';
   }

   return base64ToUint8Array(base64);
};

const concatUint8Arrays = (...arrays: Uint8Array[]): Uint8Array => {
   const totalLength = arrays.reduce((sum, array) => sum + array.length, 0);
   const result = new Uint8Array(totalLength);

   let offset = 0;

   for (const array of arrays) {
      result.set(array, offset);
      offset += array.length;
   }

   return result;
};

export const encryptDataService = async (
   data: string | object
): Promise<string> => {
   const encryptionKey = await getEncryptionKey();

   const dataToStore = typeof data === 'string' ? data : JSON.stringify(data);

   const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));

   const encodedData = new TextEncoder().encode(dataToStore);

   const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
         name: ALGORITHM,
         iv: uint8ArrayToArrayBuffer(iv),
      },
      encryptionKey,
      uint8ArrayToArrayBuffer(encodedData)
   );

   const encryptedBytes = new Uint8Array(encryptedBuffer);

   // Web Crypto returns: ciphertext + authTag
   const ciphertext = encryptedBytes.slice(
      0,
      encryptedBytes.length - AUTH_TAG_LENGTH
   );

   const authTag = encryptedBytes.slice(
      encryptedBytes.length - AUTH_TAG_LENGTH
   );

   // Final format same as your Node version:
   // iv + authTag + encryptedData
   const finalData = concatUint8Arrays(iv, authTag, ciphertext);

   return base64UrlEncode(finalData);
};

export const decryptDataService = async (
   encryptedText: string
): Promise<string | object> => {
   const decryptionKey = await getEncryptionKey();

   const encryptedBuffer = base64UrlDecode(encryptedText);

   const iv = encryptedBuffer.slice(0, IV_LENGTH);
   const authTag = encryptedBuffer.slice(
      IV_LENGTH,
      IV_LENGTH + AUTH_TAG_LENGTH
   );
   const ciphertext = encryptedBuffer.slice(IV_LENGTH + AUTH_TAG_LENGTH);

   // Web Crypto needs: ciphertext + authTag
   const encryptedDataWithTag = concatUint8Arrays(ciphertext, authTag);

   const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
         name: ALGORITHM,
         iv: uint8ArrayToArrayBuffer(iv),
      },
      decryptionKey,
      uint8ArrayToArrayBuffer(encryptedDataWithTag)
   );

   const decryptedData = new TextDecoder().decode(decryptedBuffer);

   try {
      return JSON.parse(decryptedData) as object;
   } catch {
      return decryptedData;
   }
};
