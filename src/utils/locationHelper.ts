import {BeaconProps, WifiProps} from '../types/location.ts';

export const validWifiList = (wifiList: WifiProps[]) => {
  const timestamp = Date.now();
  return wifiList.some(val => {
    return val.timestamp && timestamp - val.timestamp < 30000;
  });
};

export const validBeaconList = (beaconList: BeaconProps[]) => {
  // 유효한 비콘 리스트
  const timestamp = Date.now();
  const beaconMap = new Map<string, BeaconProps>();
  beaconList.forEach(beacon => {
    if (timestamp - beacon.timestamp < 60000) {
      const key = `${beacon.uuid}${beacon.major}${beacon.minor}`;
      const existingBeacon = beaconMap.get(key);

      if (!existingBeacon || existingBeacon.timestamp < beacon.timestamp) {
        beaconMap.set(key, beacon);
      }
    }
  });

  return Array.from(beaconMap.values());
};
