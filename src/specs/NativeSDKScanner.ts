import {TurboModule, TurboModuleRegistry} from 'react-native';

import {
  NativeSDKLocationProps,
  NativeSDKBeaconProps,
  NativeSDKWifiProps,
  NativeSDKCellProps,
  NativeBluetoothFeatureEnabled,
} from '#types/nativeSDKScanner';

export interface Spec extends TurboModule {
  bluetoothFeatureEnabled: () => Promise<NativeBluetoothFeatureEnabled>;
  scannerInitialize: (params: {
    beaconFilter: string[];
    isWifiEnable: boolean;
    isCellEnable: boolean;
    isLocationEnable: boolean;
    isBeaconEnable: boolean;
    beaconTTL?: number;
  }) => void;
  scannerIsInitialized: () => boolean;
  scannerDestroy: () => void;
  // [iOS 없음]
  beaconScannerIsRunning: () => boolean | null;
  getLocation: () => Promise<NativeSDKLocationProps>;
  getBeacons: () => Promise<NativeSDKBeaconProps[]>;
  getWifis: () => Promise<NativeSDKWifiProps[]>;
  // [iOS 없음] 호출한 시점의 기지국 정보를 반환
  getCells: () => Promise<NativeSDKCellProps[]>;
  startEscapeCheck: (apiItems: {
    baseUrl: string;
    token: string; // for header
    stickyme_uuid: string; // for header
    stickyme_version: string; // for header
    stickyme_os: string; // for header
    stickyme_location_permit: boolean; // for header
    sticky_phone_permit: boolean; // for header
    scheduleId: string; // for body
    intervalSeconds: number;
    endTime: number;
  }) => Promise<void>;
  // getAllCells: () => NativeSDKCellProps[] | null; // 호출한 시점의 모든 기지국 정보(서빙 기지국 및 인접 기지국 포함)를 반환
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeSDKScanner');
