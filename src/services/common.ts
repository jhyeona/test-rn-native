import 'react-native-get-random-values';
import Config from 'react-native-config';

import CryptoJS from 'crypto-js';

import {sentryCaptureException} from '#services/sentry.ts';

export const encryptData = (data: {}) => {
  try {
    const secretKey = Config.CRYPT_KEY;
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  } catch (error: any) {
    sentryCaptureException({error, payload: data, eventName: 'fn.encryptData'});
    return '';
  }

  // Decrypt
  // let bytes = CryptoJS.AES.decrypt(cipherValue, secretKey);
  // let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
