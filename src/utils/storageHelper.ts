import {MMKV} from 'react-native-mmkv';

// MMKV 스토리지 생성
export const storage = new MMKV();

export const setItem = (key: string, value: any) => {
  storage.set(key, value);
};

export const getItem = (key: string) => {
  return storage.getString(key);
};

export const deleteItem = (key: string) => {
  return storage.delete(key);
};
