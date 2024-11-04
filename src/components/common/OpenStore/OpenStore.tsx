import {useCallback} from 'react';
import {Linking, Platform} from 'react-native';

import CButton from '#components/common/CommonButton/CButton.tsx';
import {
  APPLE_STORE_LINKING,
  APPLE_STORE_URL,
  PLAY_STORE_LINKING,
  PLAY_STORE_URL,
} from '#constants/appStore.ts';
import {IS_IOS} from '#constants/common.ts';
import {errorToCrashlytics, logToCrashlytics} from '#services/firebase.ts';

const OpenStore = () => {
  const linkingUrl = IS_IOS ? APPLE_STORE_LINKING : PLAY_STORE_LINKING;
  const url = IS_IOS ? APPLE_STORE_URL : PLAY_STORE_URL;

  const handlePress = useCallback(async () => {
    try {
      const supported = await Linking.canOpenURL(linkingUrl);
      if (supported) {
        await Linking.openURL(linkingUrl);
        return;
      }
      await Linking.openURL(url);
    } catch (error) {
      const os = Platform.OS;
      logToCrashlytics(`ERR. OPEN ${os} STORE`);
      errorToCrashlytics(error, `open ${os} store`);
    }
  }, [linkingUrl, url]);

  return <CButton onPress={handlePress} text="업데이트하러 가기" />;
};

export default OpenStore;
