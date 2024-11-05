import {Linking} from 'react-native';

export const openSMS = (phoneNumber: string, message: string) => {
  const url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;

  Linking.openURL(url).catch(err => console.error('Error opening SMS app', err));
};
