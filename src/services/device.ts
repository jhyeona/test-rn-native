import {Platform} from 'react-native';
import {requestBluetoothEnable} from '#services/beaconScanner.ts';

export const checkDeviceFeature = async () => {
  const [beaconEnabler] = await Promise.all([await requestBluetoothEnable()]);
  return [beaconEnabler];
};

export const platformVersion =
  typeof Platform.Version === 'string'
    ? parseInt(Platform.Version, 10)
    : Platform.Version;
