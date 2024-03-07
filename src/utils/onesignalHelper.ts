import {OneSignal} from 'react-native-onesignal';
import Config from 'react-native-config';

export const onesignalLogin = (userId: number) => {
  const initId = Config.ONESIGNAL_INIT_ID;
  if (initId) {
    // OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize(initId);
    OneSignal.login(String(userId));
    console.log('onesignal init & login', userId);
  }
};

export const onesignalLogout = () => {
  OneSignal.logout();
};
