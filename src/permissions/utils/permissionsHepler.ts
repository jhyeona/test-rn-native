import {checkMultiple, openSettings, requestMultiple, RESULTS} from 'react-native-permissions';
import type {Permission} from 'react-native-permissions/src/types';

export const handleOpenSettings = () => {
  openSettings().catch(() => console.log('설정으로 이동 실패.'));
};

// 권한 확인
export const executePermissionsCheck = async (permissions: Permission[]) => {
  return await checkMultiple(permissions);
};

// 권한 확인 및 요청
export const executePermissionsRequest = async (permissions: Permission[]) => {
  return await requestMultiple(permissions);
};

// 전체 권한이 GRANTED 인지 확인
export const areAllGranted = (statuses: Record<Permission, string>, permissions: Permission[]) => {
  return permissions.every(
    permission =>
      statuses[permission] === RESULTS.GRANTED || statuses[permission] === RESULTS.LIMITED,
  );
};

// 전체 권한이 GRANTED 또는 LIMITED 인지 확인
export const areAllGrantedOrLimited = (
  statuses: Record<Permission, string>,
  permissions: Permission[],
) => {
  return permissions.every(
    permission =>
      statuses[permission] === RESULTS.GRANTED || statuses[permission] === RESULTS.LIMITED,
  );
};
