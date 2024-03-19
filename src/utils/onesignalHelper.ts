import {OneSignal} from 'react-native-onesignal';
import Config from 'react-native-config';

export const onesignalInit = () => {
  const initId = Config.ONESIGNAL_INIT_ID;
  if (initId) {
    OneSignal.initialize(initId);
  }
};

export const onesignalLogin = (userId: number, isPushApp: boolean) => {
  OneSignal.login(String(userId));
  onesignalChangeSubscription(isPushApp);
};

export const onesignalChangeSubscription = (isPushApp: boolean) => {
  let permission = OneSignal.Notifications.hasPermission();
  // const id = OneSignal.User.pushSubscription.getPushSubscriptionId();
  if (permission && isPushApp) {
    OneSignal.User.pushSubscription.optIn();
  } else {
    OneSignal.User.pushSubscription.optOut();
  }
};

export const onesignalLogout = () => {
  OneSignal.logout();
};
