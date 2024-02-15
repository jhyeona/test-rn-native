import {NativeEventEmitter, NativeModules} from 'react-native';
import {BEACON_UUID} from '../constants/common.ts';
import {BeaconProps} from '../types/location.ts';

interface BeaconModuleProps {
  requestToBluetoothEnable(): Promise<boolean>;
  startScanning(uuids: string[]): Promise<void>;
  stopScanning(): Promise<void>;
  getScanResultsForDuration(duration: number): Promise<BeaconProps[]>;
}

const BeaconModule = NativeModules.BeaconModule as BeaconModuleProps;
const eventEmitter = new NativeEventEmitter(NativeModules.BeaconModule);

export const requestBluetoothEnable = async () => {
  try {
    return await BeaconModule.requestToBluetoothEnable();
  } catch (error) {
    console.log('error', error);
    return false;
  }
};

export const requestStartBeaconScanning = async () => {
  try {
    return await BeaconModule.startScanning(BEACON_UUID)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  } catch (e) {
    console.log('beacon start Error', e);
  }
};

export const requestStopBeaconScanning = async () => {
  try {
    const result = await BeaconModule.stopScanning();
    console.log(`Stop Beacon: ${result}`);
    return result;
  } catch (e) {
    console.log('beacon stop error', e);
  }
};

export const requestBeaconScanList = async () => {
  try {
    return await BeaconModule.getScanResultsForDuration(1).then(
      (beacon: BeaconProps[]) => {
        return beacon;
      },
    );
  } catch (e) {
    console.log('beacon scan list error', e);
  }
};

export const requestAddBeaconListener = (
  callback: (beacon: BeaconProps) => void,
) => {
  try {
    if (eventEmitter.listenerCount('EVENT_BLUETOOTH_DETECTED') > 0) {
      throw new Error('Already Listening.');
    }
    eventEmitter.addListener(
      'EVENT_BLUETOOTH_DETECTED',
      (beacon: BeaconProps) => {
        callback(beacon);
      },
    );
  } catch (e) {
    console.log('add listener error:', e);
  }
};

export const requestRemoveBeaconListener = () => {
  try {
    eventEmitter.removeAllListeners('EVENT_BLUETOOTH_DETECTED');
    console.log('removeBeaconListener');
  } catch (error) {
    console.log('removeBeaconListener: ', error);
  }
};
