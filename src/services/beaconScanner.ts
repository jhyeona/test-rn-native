import {NativeModules} from 'react-native';
import {BEACON_UUID} from '../constants/common.ts';

const {BeaconModule} = NativeModules;

export const startBeaconScanning = async () => {
  try {
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

export const getBeaconDuration = async () => {
  try {
    const result = await BeaconModule.getScanResultsForDuration(1);
    console.log(`duration: ${JSON.stringify(result)}`);
  } catch (e) {
    console.log(e);
  }
};
