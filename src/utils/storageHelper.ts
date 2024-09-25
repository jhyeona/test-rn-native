import {EventEmitter} from 'events';

import {MMKV} from 'react-native-mmkv';

// MMKV 스토리지 생성
export const storage = new MMKV();

// 이벤트 발생기 생성
const storageEmitter = new EventEmitter();

// 데이터를 설정하는 함수 (값이 설정될 때 이벤트 발생)
export const setItem = (key: string, value: any) => {
  storage.set(key, value);
  storageEmitter.emit('storageChange', {key, value});
};

// 값을 가져오는 함수
export const getItem = (key: string) => {
  return storage.getString(key);
};

// 리스너를 추가하는 함수
export const addStorageListener = (
  callback: (data: {key: string; value: string}) => void,
) => {
  storageEmitter.on('storageChange', callback);
};

// 리스너를 제거하는 함수
export const removeStorageListener = (
  callback: (data: {key: string; value: string}) => void,
) => {
  storageEmitter.off('storageChange', callback);
};
