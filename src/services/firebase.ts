import {firebase} from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';

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
    //
  }
};

export const logErrorToCrashlytics = (e: Error, errorName: string) => {
  // Crashlytics
  try {
    defaultAppCrashlytics.recordError(e, errorName);
  } catch (error) {
    //
  }
};
