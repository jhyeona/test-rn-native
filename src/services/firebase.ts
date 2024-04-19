import {firebase} from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import {encryptData} from '#services/common.ts';

const defaultAppCrashlytics = firebase.crashlytics();

export const logScreenViewToAnalytics = async (
  screenName: string,
  screenClass: string,
) => {
  // Analytics Screen Tracking
  try {
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenClass,
    });
  } catch (error) {
    // ignore
  }
};

export const errorToCrashlytics = (e: any, errorName: string) => {
  // Crashlytics - 에러 전송
  try {
    const newError = JSON.stringify(e);
    defaultAppCrashlytics.recordError(new Error(newError), errorName);
  } catch (error) {
    // ignore
  }
};

export const logToCrashlytics = (message: string) => {
  // Crashlytics - 로그 전송
  defaultAppCrashlytics.log(message);
};

export const setAttToCrashlytics = async (data: {}) => {
  // Crashlytics - 데이터 전송
  const encryptedData = encryptData(data);
  await defaultAppCrashlytics.setAttribute('userReqData', encryptedData);
};
