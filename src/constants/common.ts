import {Platform} from 'react-native';

export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';
export const BEACON_UUID = [
  // 엘핀 비콘 UUID // 추후 개별 비콘 요청 시 변경 예정
  'fda50693-a4e2-4fb1-afcf-c6eb07647825',
  'e7b28cf9-f35d-465a-b284-e82cc0082ea2',
];
