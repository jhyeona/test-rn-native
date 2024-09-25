import Config from 'react-native-config';
import {OneSignal} from 'react-native-onesignal';

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

export const onesignalLogin = async (userId: string, isPushApp: boolean) => {
  OneSignal.login(userId);
  await onesignalChangeSubscription(isPushApp);
};

export const onesignalChangeSubscription = async (isPushApp: boolean) => {
  let permission = await OneSignal.Notifications.getPermissionAsync();
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
