import {MMKV} from 'react-native-mmkv';

// MMKV 스토리지 생성
export const storage = new MMKV();

// 데이터를 설정하는 함수
export const setItem = (key: string, value: any) => {
  storage.set(key, value);
};

// 값을 가져오는 함수
export const getItem = (key: string) => {
  return storage.getString(key);
};
