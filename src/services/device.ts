import {Platform} from 'react-native';

export const platformVersion =
  typeof Platform.Version === 'string' ? parseInt(Platform.Version, 10) : Platform.Version;
