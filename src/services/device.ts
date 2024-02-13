import {requestBluetoothEnable} from './beaconScanner.ts';

export const checkDeviceFeature = async () => {
  const [beaconEnabler] = await Promise.all([await requestBluetoothEnable()]);
  return [beaconEnabler];
};
