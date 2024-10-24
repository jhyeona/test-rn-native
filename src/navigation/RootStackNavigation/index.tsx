import React, {useEffect, useRef} from 'react';
import {Alert} from 'react-native';
import BootSplash from 'react-native-bootsplash';

import {NavigationContainer, useNavigationContainerRef} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useRecoilState} from 'recoil';

import {ACCESS_TOKEN, TOKEN_ERROR} from '#constants/common.ts';
import Academy from '#containers/Academy';
import FindPassword from '#containers/FindPassword';
import Initialize from '#containers/Initialize';
import Onboarding from '#containers/Onboarding';
import PrivacyPolicy from '#containers/PrivacyPolicy';
import ReasonCreator from '#containers/ReasonCreator';
import ReasonStatement from '#containers/ReasonStatement';
import ScheduleHistory from '#containers/ScheduleHistory';
import SelectAcademy from '#containers/SelectAcademy';
import SignIn from '#containers/SignIn';
import SignUp from '#containers/SignUp';
import UpdatePassword from '#containers/UpdatePassword';
import UserWithdraw from '#containers/UserWithdraw';
import TabNavigation from '#navigation/TabNavigation';
import GlobalState from '#recoil/Global';
import {logScreenViewToAnalytics} from '#services/firebase.ts';
import {onesignalInit} from '#utils/onesignalHelper.ts';
import {getStorageItem, storage} from '#utils/storageHelper.ts';
const RootStack = createNativeStackNavigator();

const screenOptions = {headerShown: false};

const RootStackNavigation = () => {
  const navigationRef = useNavigationContainerRef();
  const [isLogin, setIsLogin] = useRecoilState(GlobalState.isLoginState);
  const routeNameRef = useRef<string>();

  const handleOnReady = () => {
    routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name ?? '';

    BootSplash.hide({fade: true}).then();
  };

  const handleOnStateChange = async () => {
    // connected Firebase
    const previousRouteName = routeNameRef.current;
    const currentRouteName: string = navigationRef?.current?.getCurrentRoute()?.name ?? '';

    if (previousRouteName !== currentRouteName) {
      await logScreenViewToAnalytics(currentRouteName, currentRouteName);
    }
    routeNameRef.current = currentRouteName;
  };

  useEffect(() => {
    onesignalInit();
    // mmkv storage listener
    const storageListener = storage.addOnValueChangedListener(changedKey => {
      const newValue = getStorageItem(changedKey);
      if (changedKey === ACCESS_TOKEN && newValue === TOKEN_ERROR) {
        Alert.alert('세션이 만료되었습니다.\n다시 로그인해주세요.');
        setIsLogin(false);
      }
    });

    const token = getStorageItem(ACCESS_TOKEN);
    setIsLogin(!!token);

    return () => {
      storageListener.remove();
    };
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => handleOnReady()}
      onStateChange={handleOnStateChange}>
      <RootStack.Navigator screenOptions={screenOptions}>
        {!isLogin ? (
          <>
            <RootStack.Screen name="Init" component={Initialize} />
            <RootStack.Screen name="SignIn" component={SignIn} />
            <RootStack.Screen name="SignUp" component={SignUp} />
            <RootStack.Screen name="FindPassword" component={FindPassword} />
            <RootStack.Screen name="Onboarding" component={Onboarding} />
          </>
        ) : (
          <>
            <RootStack.Screen name="Root" component={TabNavigation} />
            <RootStack.Screen name="ScheduleHistory" component={ScheduleHistory} />
            <RootStack.Screen name="ReasonStatement" component={ReasonStatement} />
            <RootStack.Screen name="ReasonCreator" component={ReasonCreator} />
            <RootStack.Screen name="Academy" component={Academy} />
            <RootStack.Screen name="SelectAcademy" component={SelectAcademy} />
            <RootStack.Screen name="UpdatePassword" component={UpdatePassword} />
            <RootStack.Screen name="UserWithdraw" component={UserWithdraw} />
            <RootStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackNavigation;
