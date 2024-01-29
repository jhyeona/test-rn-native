import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';

export const usePreviousScreenName = (
  navigation: NativeStackNavigationHelpers,
) => {
  // 이전 화면의 이름
  const previousScreenList =
    navigation.getState()?.routes[0]?.state?.routeNames;
  return (
    previousScreenList && previousScreenList[previousScreenList.length - 1]
  );
};
