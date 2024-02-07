import {NativeModules} from 'react-native';

const {LocationModule} = NativeModules;

export const getLocationInfo = async () => {
  try {
    // if (IS_IOS) ...
    const location: {
      accuracy: number;
      altitude: number;
      latitude: number;
      longitude: number;
    } = await LocationModule.getGpsLocation();
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
