import CryptoJS from "crypto-js";

const be = "jdoejdedop2ieojfcnwomvn2wijimco2d";

export function encryptData(data) {
  if (!data) return "";
  return CryptoJS.AES.encrypt(JSON.stringify(data), be).toString();
}

export function decryptData(cipherText) {
  if (!cipherText) return "";
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, be);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) return "";
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Error decrypting data:", error);
    return "";
  }
}
