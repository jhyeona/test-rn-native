import {requestNotifications} from 'react-native-permissions';

import {IS_IOS} from '#constants/common.ts';
import {
  areAllGranted,
  areAllGrantedOrLimited,
  executePermissionsCheck,
  executePermissionsRequest,
} from '#permissions/utils/permissionsHepler.ts';

import {ANDROID_PERMISSIONS, FeatureType, IOS_PERMISSIONS} from './utils/os.ts';

const PERMISSIONS_CONFIG = IS_IOS ? IOS_PERMISSIONS : ANDROID_PERMISSIONS;

// 권한 확인 및 요청
export const requestFeaturePermissions = async (feature: FeatureType, orLimited?: boolean) => {
  const permissions = PERMISSIONS_CONFIG[feature];
  if (permissions.length === 0) {
    // 별도의 권한 요청이 필요 없는 경우
    return true;
  }
  const statuses = await executePermissionsRequest(permissions);
  return orLimited
    ? areAllGrantedOrLimited(statuses, permissions)
    : areAllGranted(statuses, permissions);
};

// 권한 확인만 (요청X)
export const checkFeaturePermissions = async (feature: FeatureType, orLimited?: boolean) => {
  const permissions = PERMISSIONS_CONFIG[feature];
  if (permissions.length === 0) {
    return true;
  }
  const statuses = await executePermissionsCheck(permissions);
  return orLimited
    ? areAllGrantedOrLimited(statuses, permissions)
    : areAllGranted(statuses, permissions);
};

// ============================================ //
// 위치 권한 요청 및 확인
export const requestLocationPermissions = async () => {
  return requestFeaturePermissions('location');
};

// 자동이탈체크 위치 권한 요청 및 확인
export const requestUseEscapeLocationPermissions = async () => {
  return requestFeaturePermissions('useEscapeLocation');
};

// 위치 권한 확인
export const checkLocationPermissions = async () => {
  return checkFeaturePermissions('location');
};

// 전화 권환 요청 및 확인
export const requestPhonePermission = async () => {
  return requestFeaturePermissions('phone');
};

// 전화 권한 확인
export const checkPhonePermissions = async () => {
  return checkFeaturePermissions('phone');
};

// 갤러리 접근 권한 요청 및 확인
export const requestLibraryPermissions = async () => {
  return requestFeaturePermissions('library', IS_IOS); // ios 는 Limited 도 허용
};

// 카메라 접근 권한 요청 및 확인
export const requestCameraPermissions = async () => {
  return requestFeaturePermissions('camera');
};

// 백그라운드 권한 요청 및 확인
export const requestBackgroundPermissions = async () => {
  return requestFeaturePermissions('background');
};

// 알림 권한 요청 및 확인
export const requestNotificationsPermission = async () => {
  const {status} = await requestNotifications(['alert', 'badge', 'sound']);
  return status;
};
