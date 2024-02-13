import {NativeModules} from 'react-native';

interface LocationModuleProps {
  getGpsLocation(): Promise<any>;
  getWifiList(): Promise<any>;
  getConnectedWifi(): Promise<any>;
}

const LocationModule = NativeModules.LocationModule as LocationModuleProps;

export const getLocationInfo = async () => {
  try {
    const location = await LocationModule.getGpsLocation(); // TODO: NewLocationModule 로 변경
    console.log(`location: ${JSON.stringify(location)}`);
  } catch (e) {
    console.log(e);
  }
};

export const getWifiListInfo = async () => {
  try {
    const wifiList = await LocationModule.getWifiList();
    console.log(`wifiList: ${JSON.stringify(wifiList)}`);
  } catch (e) {
    console.log(e);
  }
};

export const getConnectedWifiInfo = async () => {
  try {
    const connectedWifi = await LocationModule.getConnectedWifi();
    console.log(`connectedWifi: ${JSON.stringify(connectedWifi)}`);
  } catch (e) {
    console.log(e);
  }
};
