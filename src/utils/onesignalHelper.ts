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

export const onesignalLogin = async (userId: string) => {
  OneSignal.login(userId);
  onesignalAddTag({tagName: 'userId', tagValue: userId});
  await onesignalChangeSubscription();
};

export const onesignalChangeSubscription = async () => {
  const isPermission = await OneSignal.Notifications.getPermissionAsync();
  if (isPermission) OneSignal.User.pushSubscription.optIn();
};

export const onesignalLogout = () => {
  OneSignal.logout();
};

export const onesignalAddTag = ({tagName, tagValue}: {tagName: string; tagValue: string}) => {
  OneSignal.User.addTag(tagName, tagValue);
};
