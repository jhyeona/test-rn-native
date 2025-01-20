import * as Sentry from '@sentry/react-native';

import {UserInfoProps} from '#types/user.ts';

export const useSentrySetUser = ({userData}: {userData?: UserInfoProps}) => {
  if (!userData) return;
  const {userId} = userData;
  Sentry.setUser({
    userId,
  });
};
