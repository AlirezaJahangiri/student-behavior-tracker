import CryptoJS from "crypto-js";

const KEY = process.env.ENCRYPTION_KEY?.trim(); // ← فاصله‌های ناخواسته حذف می‌شن

export function encryptData(data) {
  if (!data) return "";
  return CryptoJS.AES.encrypt(JSON.stringify(data), KEY).toString();
}

export function decryptData(cipherText) {
  if (!cipherText) return "";
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) return "";
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Error decrypting data:", error);
    return "";
  }
}
