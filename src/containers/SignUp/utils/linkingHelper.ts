import {Linking} from 'react-native';

import {sentryCaptureException} from '#services/sentry.ts';

export const openSMS = (phoneNumber: string, message: string) => {
  const encodedMessage = encodeURIComponent(message);
  const url = `sms:${phoneNumber}?&body=${encodedMessage}`;

  // SMS 앱 열기
  Linking.openURL(url).catch(error => {
    const payload = {phoneNumber, message, url};
    sentryCaptureException({
      error,
      payload,
      eventName: 'openSMS',
    });
  });
};
