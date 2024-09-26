import {StyleSheet} from 'react-native';
import {getAndroidId, getDeviceId, getUniqueId} from 'react-native-device-info';

import {IS_ANDROID} from '#constants/common.ts';
import {errorToCrashlytics, logToCrashlytics} from '#services/firebase.ts';

export const getDeviceUUID = async () => {
  try {
    const deviceId = getDeviceId();
    let uniqueId = await getUniqueId();
    if (!!uniqueId && IS_ANDROID) {
      uniqueId = await getAndroidId();
    }
    return `${deviceId}-${uniqueId}`;
  } catch (error) {
    logToCrashlytics('rn - get device uuid');
    errorToCrashlytics(error, 'rn_getDeviceUUID');
  }
};

export const commonStyles = StyleSheet.create({
  tabBarStyle: {
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
  },
});
