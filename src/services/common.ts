import 'react-native-get-random-values';
import CryptoJS from 'crypto-js';
import Config from 'react-native-config';
import {errorToCrashlytics} from '#services/firebase.ts';

export const encryptData = (data: {}) => {
  try {
    const secretKey = Config.CRYPT_KEY;
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  } catch (e: any) {
    errorToCrashlytics(e, 'encryptDataError');
    return '';
  }

  // Decrypt
  // let bytes = CryptoJS.AES.decrypt(cipherValue, secretKey);
  // let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
