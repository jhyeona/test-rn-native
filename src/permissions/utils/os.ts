import {PERMISSIONS} from 'react-native-permissions';
import {Permission} from 'react-native-permissions/src/types.ts';

import {platformVersion} from '#services/device.ts';

export type FeatureType =
  | 'phone'
  | 'location'
  | 'useEscapeLocation'
  | 'notifications'
  | 'library'
  | 'camera'
  | 'background';

/**
 * FOR IOS
 * */
const IOS_PERMISSIONS: Record<FeatureType, Permission[]> = {
  phone: [],
  location: [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],
  useEscapeLocation: [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, PERMISSIONS.IOS.LOCATION_ALWAYS],
  notifications: [],
  library: [PERMISSIONS.IOS.PHOTO_LIBRARY],
  camera: [PERMISSIONS.IOS.CAMERA],
  background: [],
};

/**
 * FOR ANDROID
 * */
const getAndroidPhonePermissions = (): Permission[] => {
  const basePermissions: Permission[] = [PERMISSIONS.ANDROID.READ_PHONE_STATE];

  // 26 이상: READ_PHONE_NUMBERS
  if (platformVersion > 25) {
    basePermissions.push(PERMISSIONS.ANDROID.READ_PHONE_NUMBERS);
  }
  return basePermissions;
};

const getAndroidLocationPermissions = (): Permission[] => {
  const basePermissions: Permission[] = [
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
  ];

  // 31 이상: BLE 관련 권한 추가
  if (platformVersion > 30) {
    basePermissions.push(PERMISSIONS.ANDROID.BLUETOOTH_SCAN, PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
  }
  return basePermissions;
};

const getAndroidLibraryPermissions = (): Permission[] => {
  // 32 이하 : READ_EXTERNAL_STORAGE
  // 33 이상 : READ_MEDIA_IMAGES
  // 34 이상 : READ_MEDIA_VISUAL_USER_SELECTED
  if (platformVersion <= 32) {
    return [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE];
  } else {
    if (platformVersion >= 34) {
      return [PERMISSIONS.ANDROID.READ_MEDIA_VISUAL_USER_SELECTED];
    }
    return [];
  }
};

const ANDROID_PERMISSIONS: Record<FeatureType, Permission[]> = {
  phone: getAndroidPhonePermissions(),
  location: getAndroidLocationPermissions(),
  useEscapeLocation: getAndroidLocationPermissions(),
  notifications: [], // requestNotifications 별도 사용
  library: getAndroidLibraryPermissions(),
  camera: [PERMISSIONS.ANDROID.CAMERA],
  background: [PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION],
};

export {IOS_PERMISSIONS, ANDROID_PERMISSIONS};
