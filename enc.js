import { encryptData } from './crypto.js';

const aesKey = "xYbbQCPMQfvgem+WydsqheE0QITgm/xcMrC8xdd9AEY=";

(async () => {
  try {
    const encrypted = await encryptData("James", aesKey);
    console.log(encrypted);
  } catch (err) {
    console.error("Encryption error:", err);
  }
})();
