import Config from 'react-native-config';
import {MMKV, Mode} from 'react-native-mmkv';

import {ACCESS_TOKEN, REFRESH_TOKEN} from '#constants/common.ts';

// MMKV 스토리지 생성
export const storage = new MMKV({
  id: `checkhere-common-storage`,
  encryptionKey: Config.CRYPT_KEY,
  mode: Mode.SINGLE_PROCESS,
  readOnly: false,
  // path:
});

export const setStorageItem = (key: string, value: any) => {
  storage.set(key, value);
};

export const getStorageItem = (key: string) => {
  return storage.getString(key);
};

export const deleteStorageItem = (key: string) => {
  return storage.delete(key);
};

export const clearStorage = () => {
  deleteStorageItem(ACCESS_TOKEN);
  deleteStorageItem(REFRESH_TOKEN);
  // storage.recrypt(undefined); // remove encrypt
  return storage.clearAll();
};
