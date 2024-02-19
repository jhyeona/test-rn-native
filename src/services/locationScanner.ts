import {NativeModules} from 'react-native';
import {LocationProps, WifiProps} from '../types/location.ts';
import {uniq} from 'react-native-permissions/dist/typescript/utils';

interface LocationModuleProps {
  getGpsLocation(): Promise<any>;
  getWifiList(): Promise<any>;
  getConnectedWifi(): Promise<any>;
}

const LocationModule = NativeModules.LocationModule as LocationModuleProps;

export const requestGetLocationInfo = async () => {
  try {
    // TODO: NewLocationModule 로 변경
    return await LocationModule.getGpsLocation().then(
      (location: LocationProps) => {
        return location;
      },
    );
  } catch (e) {
    console.log(e);
  }
};

export const requestGetWifiListInfo = async () => {
  const validateWifi = (wifi: WifiProps) =>
    wifi.bssid !== '' &&
    wifi.bssid !== null &&
    wifi.bssid !== 'null' &&
    wifi.ssid !== '' &&
    wifi.ssid !== 'unknown ssid' &&
    wifi.ssid !== null &&
    wifi.ssid !== 'null';

  try {
    return await LocationModule.getWifiList().then((wifi: WifiProps[]) => {
      const filteredWifi = wifi.filter(validateWifi).map(item => ({
        ...item,
        timestamp: Date.now(),
      }));
      return filteredWifi.sort((a, b) => b.rssi - a.rssi);
    });
  } catch (e) {
    console.log(e);
  }
};

export const requestGetConnectedWifiInfo = async () => {
  try {
    return await LocationModule.getConnectedWifi().then((wifi: WifiProps) => {
      return {...wifi, timestamp: Date.now()};
    });
    // console.log(`connectedWifi: ${JSON.stringify(connectedWifi)}`);
  } catch (e) {
    console.log(e);
  }
};

export const requestWifiList = async () => {
  const wifiListResult: WifiProps[] = [];
  const wifiList = await requestGetWifiListInfo();
  const connectedWifi = await requestGetConnectedWifiInfo();

  if (wifiList) {
    wifiListResult.push(...wifiList);
  }
  if (connectedWifi) {
    wifiListResult.push(connectedWifi);
  }
  // const uniqueList = Array.from(
  //   new Set(wifiListResult.map(item => item.bssid)),
  // ).map(bssid => wifiListResult.find(item => item.bssid === bssid));

  return wifiListResult.sort((a, b) => b.rssi - a.rssi);
};
