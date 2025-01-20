import {StyleSheet} from 'react-native';
import {getAndroidId, getDeviceId, getUniqueId} from 'react-native-device-info';

import {IS_ANDROID} from '#constants/common.ts';
import {sentryCaptureException} from '#services/sentry.ts';

export const getDeviceUUID = async () => {
  try {
    const deviceId = getDeviceId();
    let uniqueId = '';
    if (IS_ANDROID) {
      uniqueId = await getAndroidId();
    } else {
      uniqueId = await getUniqueId();
    }
    return `${deviceId}-${uniqueId}`;
  } catch (error) {
    sentryCaptureException({error, eventName: 'fn.getDeviceUUID'});
  }
};

export const commonStyles = StyleSheet.create({
  tabBarStyle: {
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    paddingTop: 5,
  },
});
