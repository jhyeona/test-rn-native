import {Platform} from 'react-native';
import {
  openSettings,
  PERMISSIONS,
  requestMultiple,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';
import {Permission} from 'react-native-permissions/src/types.ts';

import {IS_ANDROID, IS_IOS} from '#constants/common.ts';
import {platformVersion} from '#services/device.ts';

export const handleOpenSettings = () => {
  openSettings().catch(() => console.log('설정으로 이동 실패.'));
};

export const requestNotificationsPermission = async () => {
  // 알림 권한 확인
  const {status} = await requestNotifications(['alert', 'badge', 'sound']);
  return status;
};

export const requestLocationPermissions = async () => {
  // 위치 권한 확인
  let permissionsList: Array<Permission> = [];
  if (IS_IOS) {
    permissionsList = [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE];

    return requestMultiple(permissionsList).then(statuses => {
      return statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.GRANTED;
    });
  }
  // IS ANDROID
  permissionsList = [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
  if (platformVersion > 30) {
    permissionsList.push(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
  }
  return requestMultiple(permissionsList).then(statuses => {
    if (platformVersion > 30) {
      return (
        statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] ===
          RESULTS.GRANTED &&
        statuses[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] === RESULTS.GRANTED
      );
    }
    return (
      statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED
    );
  });
};
