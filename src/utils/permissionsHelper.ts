import {
  openSettings,
  PERMISSIONS,
  requestMultiple,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';
import {IS_ANDROID, IS_IOS} from '../constants/common.ts';
import {Platform} from 'react-native';
import {Permission} from 'react-native-permissions/src/types.ts';

export const platformVersion =
  // Only IOS 14 Methods - checkLocationAccuracy , requestLocationAccuracy, openPhotoPicker
  typeof Platform.Version === 'string'
    ? parseInt(Platform.Version, 10)
    : Platform.Version;

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
    permissionsList = [PERMISSIONS.IOS.LOCATION_ALWAYS];
  }
  if (IS_ANDROID) {
    permissionsList = [
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    ];
  }

  /** why not checkMultiple?
   * Android will never return blocked on checkMultiple, you have to call requestMultiple to get the info. */
  return requestMultiple(permissionsList).then(statuses => {
    if (
      statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.BLOCKED ||
      statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] === RESULTS.BLOCKED
    ) {
      // ANDROID / IOS 위치 권한
      return 'locationBlock';
    }
    if (
      statuses[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] === RESULTS.BLOCKED ||
      statuses[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] === RESULTS.BLOCKED
    ) {
      // ANDROID 근처 기기 권한
      return 'bluetoothBlock';
    }
    return true;
  });
};
