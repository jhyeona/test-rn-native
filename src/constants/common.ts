import {Platform} from 'react-native';

import {ColorType} from '#components/common/StatusInfoContainer';
import {COLORS} from '#constants/colors.ts';

import {version} from '../../package.json';

export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';

export const ACCESS_TOKEN = 'access_token';
export const REFRESH_TOKEN = 'refresh_token';
export const TOKEN_ERROR = 'token_error';

export const BEACON_UUID = [
  // sticky 비콘 UUID // 추후 개별 비콘 요청 시 변경 예정
  'fda50693-a4e2-4fb1-afcf-c6eb07647825',
  'e7b28cf9-f35d-465a-b284-e82cc0082ea2',
];

/** 상태 값을 표시하는 컴포넌트의 컬러별 정의를 위한 스타일 */
export const STATUS_STYLE_MAP: Record<ColorType | string, {textColor: string; bgc: string}> = {
  gray: {textColor: COLORS.gray, bgc: COLORS.lightGray},
  blue: {
    textColor: COLORS.primary,
    bgc: COLORS.primaryLight,
  },
  red: {
    textColor: COLORS.dark.red,
    bgc: COLORS.light.red,
  },
};

export const MAX_FILE_SIZE = 1024 * 1024 * 3; // 3MB
export const APP_VERSION = version;

export const DATE_FORMAT_DASH = 'YYYY-MM-DD';
export const DATE_FORMAT_DOT = 'YYYY.MM.DD';
export const REQ_DATE_FORMAT = 'YYYYMMDD';

export const sticky_BEACONS = [
  'fda50693-a4e2-4fb1-afcf-c6eb07647825',
  'e7b28cf9-f35d-465a-b284-e82cc0082ea2',
];
