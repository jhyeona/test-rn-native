import {OneSignal} from 'react-native-onesignal';
import Config from 'react-native-config';

export const onesignalInit = () => {
  const initId = Config.ONESIGNAL_INIT_ID;
  if (initId) {
    OneSignal.initialize(initId);
    // OneSignal.Notifications.addEventListener('foregroundWillDisplay', event => {
    //   event.preventDefault();
    //   // some async work
    //   console.log('OneSignal: notification will be shown:', event);
    //
    //   // Use display() to display the notification after some async work
    //   event.getNotification().display();
    // });
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
