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
import {sentryCaptureException} from '#services/sentry.ts';

const os = Platform.OS;
const url = IS_IOS ? APPLE_STORE_URL : PLAY_STORE_URL;
const linkingUrl = IS_IOS ? APPLE_STORE_LINKING : PLAY_STORE_LINKING;

const OpenStore = () => {
  const handlePress = useCallback(async () => {
    try {
      const supported = await Linking.canOpenURL(linkingUrl);
      if (supported) {
        await Linking.openURL(linkingUrl);
        return;
      }
      await Linking.openURL(url);
    } catch (error) {
      sentryCaptureException({error, eventName: 'fn.OpenStore', payload: {os, url, linkingUrl}});
    }
  }, [linkingUrl, url]);

  return <CButton onPress={handlePress} text="업데이트하러 가기" />;
};

export default OpenStore;
