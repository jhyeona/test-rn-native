import 'react-native-get-random-values';
import CryptoJS from 'crypto-js';
import Config from 'react-native-config';

export const encryptData = (data: {}) => {
  const secretKey = Config.CRYPT_KEY;
  const cipherValue = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey,
  ).toString();

  // Decrypt
  // let bytes = CryptoJS.AES.decrypt(cipherValue, secretKey);
  // let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
