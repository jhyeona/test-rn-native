import React, {useEffect, useRef} from 'react';
import {useMMKVListener} from 'react-native-mmkv';
import BootSplash from 'react-native-bootsplash';
import {useRecoilState} from 'recoil';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from '#containers/SignIn';
import TabNavigation from '#navigation/TabNavigation';
import SignUp from '#containers/SignUp';
import FindPassword from '#containers/FindPassword';
import globalState from '#recoil/Global';
import {storage} from '#utils/storageHelper.ts';
import LectureDetail from '#containers/LectureDetail/index.tsx';
import ScheduleHistory from '#containers/ScheduleHistory';
import Academy from '#containers/Academy';
import UpdatePassword from '#containers/UpdatePassword';
import UserWithdraw from '#containers/UserWithdraw';
import PrivacyPolicy from '#containers/PrivacyPolicy';
import {logScreenViewToAnalytics} from '#services/firebase.ts';

const RootStack = createNativeStackNavigator();

const RootStackNavigation = () => {
  const navigationRef = useNavigationContainerRef();
  const [isLogin, setIsLogin] = useRecoilState(globalState.isLoginState);
  const routeNameRef = useRef<string>();

  const handleOnReady = () => {
    routeNameRef.current =
      navigationRef?.current?.getCurrentRoute()?.name ?? '';
    // eslint-disable-next-line import/no-named-as-default-member
    BootSplash.hide({fade: true}).then();
  };

  const handleOnStateChange = async () => {
    // connected Firebase
    const previousRouteName = routeNameRef.current;
    const currentRouteName: string =
      navigationRef?.current?.getCurrentRoute()?.name ?? '';

    if (previousRouteName !== currentRouteName) {
      await logScreenViewToAnalytics(currentRouteName, currentRouteName);
    }
    routeNameRef.current = currentRouteName;
  };

  const token = storage.getString('access_token');

  // MMKV 리스너로 저장소 변화 감지
  useMMKVListener(key => {
    if (key === 'access_token') {
      const changedValue = storage.getString(key);
      changedValue ? setIsLogin(true) : setIsLogin(false);
    }
  });

  useEffect(() => {
    token ? setIsLogin(true) : setIsLogin(false);
  }, [setIsLogin, token]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => handleOnReady()}
      onStateChange={handleOnStateChange}>
      <RootStack.Navigator>
        {!isLogin && !token ? (
          <>
            <RootStack.Screen
              name="SignIn"
              component={SignIn}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name="SignUp"
              component={SignUp}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name="FindPassword"
              component={FindPassword}
              options={{headerShown: false}}
            />
          </>
        ) : (
          <>
            <RootStack.Screen
              name="Root"
              component={TabNavigation}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name="LectureDetail"
              component={LectureDetail}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name="ScheduleHistory"
              component={ScheduleHistory}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name="Academy"
              component={Academy}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name="UpdatePassword"
              component={UpdatePassword}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name="UserWithdraw"
              component={UserWithdraw}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicy}
              options={{headerShown: false}}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackNavigation;
