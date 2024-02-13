import {NativeModules} from 'react-native';
import {BEACON_UUID} from '../constants/common.ts';
import {BeaconProps} from '../types/location.ts';

interface BeaconModuleProps {
  requestToBluetoothEnable(): Promise<boolean>;
  startScanning(uuids: string[]): Promise<void>;
  stopScanning(): Promise<void>;
  getScanResultsForDuration(duration: number): Promise<BeaconProps[]>;
}

const BeaconModule = NativeModules.BeaconModule as BeaconModuleProps;

export const requestBluetoothEnable = async () => {
  try {
    return await BeaconModule.requestToBluetoothEnable();
  } catch (error) {
    console.log('error', error);
    return false;
  }
};

export const startBeaconScanning = async () => {
  try {
    console.log(BEACON_UUID);
    const result = await BeaconModule.startScanning(BEACON_UUID);
    console.log(`Stop Beacon: ${result}`);
  } catch (e) {
    console.log(e);
  }
};

export const stopBeaconScanning = async () => {
  try {
    const result = await BeaconModule.stopScanning();
    console.log(`Stop Beacon: ${result}`);
  } catch (e) {
    console.log(e);
  }
};

export const getBeaconScanList = async () => {
  try {
    const result = await BeaconModule.getScanResultsForDuration(1);
    console.log(`duration: ${JSON.stringify(result)}`);
  } catch (e) {
    console.log(e);
  }
};
