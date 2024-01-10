import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

export const logFBScreenView = async (
  screenName: string,
  screenClass: string,
) => {
  try {
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenClass,
    });
  } catch (e) {
    // ignore
  }
};

export const logFBCrashlytics = (error: Error, errorName = '') => {
  try {
    crashlytics().recordError(error, errorName);
  } catch (e) {
    // ignore
  }
};
