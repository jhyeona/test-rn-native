import {Platform} from 'react-native';
import Config from 'react-native-config';

import moment from 'moment';

import {ACCESS_TOKEN, APP_VERSION, sticky_BEACONS} from '#constants/common.ts';
import {checkLocationPermissions, checkPhonePermissions} from '#permissions/index.ts';
import {sentryCaptureException} from '#services/sentry.ts';
import {NativeSDKScannerInit, StartEscapeCheckProps} from '#types/nativeSDKScanner.ts';
import {getDeviceUUID} from '#utils/common.ts';
import {getStorageItem} from '#utils/storageHelper.ts';

import NativeSDKScanner from '../specs/NativeSDKScanner.ts';

export const bluetoothFeatureEnabled = async () => {
  return await NativeSDKScanner.bluetoothFeatureEnabled();
};

export const initScanner = ({
  isWifiEnable = true,
  isLocationEnable = true,
  isCellEnable = false,
  isBeaconEnable = true,
  beaconFilter = sticky_BEACONS,
  beaconTTL = 30,
}: NativeSDKScannerInit) => {
  try {
    NativeSDKScanner.scannerInitialize({
      isWifiEnable,
      isLocationEnable,
      isCellEnable,
      isBeaconEnable,
      beaconFilter,
      beaconTTL,
    });
  } catch (error) {
    sentryCaptureException({error, eventName: '[Sticky SDK] initScanner'});
  }
};

export const isInitScanner = () => {
  return NativeSDKScanner.scannerIsInitialized();
};

export const isRunningBeaconScanner = () => {
  return NativeSDKScanner.beaconScannerIsRunning();
};

export const destroyScanner = () => {
  NativeSDKScanner.scannerDestroy();
};

export const getBeacons = async () => {
  try {
    const beacons = await NativeSDKScanner.getBeacons();
    return (
      beacons.map(b => {
        return {
          uuid: b.identifier,
          major: b.major.toString(),
          minor: b.minor.toString(),
          rssi: b.rssi,
          // 아래는 임시데이터
          mac: '',
          proximity: 0,
          accuracy: 0,
          timestamp: 0,
        };
      }) ?? []
    );
  } catch (error) {
    sentryCaptureException({error, eventName: '[Sticky SDK] getBeacons'});
  }
};

export const getWifis = async () => {
  try {
    const wifis = await NativeSDKScanner.getWifis();
    return (
      wifis.map(w => {
        return {
          ssid: w.ssid.replace(/"/g, '').trim(),
          bssid: w.bssid,
          rssi: w.rssi,
        };
      }) ?? []
    );
  } catch (error) {
    sentryCaptureException({error, eventName: '[Sticky SDK] getWifis'});
  }
};

export const getLocation = async () => {
  try {
    const locations = await NativeSDKScanner.getLocation();
    return {
      latitude: Number(locations.lat),
      longitude: Number(locations.lon),
      altitude: Number(locations.alt),
    };
  } catch (error) {
    sentryCaptureException({error, eventName: '[Sticky SDK] getLocation'});
  }
};

export const getCells = async () => {
  try {
    return await NativeSDKScanner.getCells();
  } catch (error) {
    sentryCaptureException({error, eventName: '[Sticky SDK] getCells'});
  }
};

export const startEscapeCheck = async ({
  scheduleId,
  intervalSeconds,
  endTime,
}: StartEscapeCheckProps) => {
  try {
    const uuid = await getDeviceUUID();
    const locationPermission = await checkLocationPermissions();
    const phonePermission = await checkPhonePermissions();
    await NativeSDKScanner.startEscapeCheck({
      baseUrl: Config.BASE_URL,
      token: getStorageItem(ACCESS_TOKEN) ?? 'NO_TOKEN',
      stickyme_uuid: uuid ?? 'NO_UUID',
      sticky_version: APP_VERSION,
      sticky_os: `${Platform.OS} ${Platform.Version}`,
      sticky_location_permit: locationPermission,
      sticky_phone_permit: phonePermission,
      scheduleId,
      intervalSeconds: intervalSeconds ?? 300,
      endTime: endTime ?? moment().endOf('day').unix(),
    });
  } catch (error) {
    sentryCaptureException({error, eventName: '[Sticky SDK] startEscapeCheck'});
  }
};
