import React, {useEffect, useRef} from 'react';
import BootSplash from 'react-native-bootsplash';

import {NavigationContainer, useNavigationContainerRef} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useRecoilState, useSetRecoilState} from 'recoil';

import {tokenRefresh} from '#apis/common.ts';
import OpenStore from '#components/common/OpenStore/OpenStore.tsx';
import {ACCESS_TOKEN, APP_VERSION, IS_IOS, TOKEN_ERROR} from '#constants/common.ts';
import Academy from '#containers/Academy';
import CustomerService from '#containers/CustomerService';
import FindPassword from '#containers/FindPassword';
import GetBeacon from '#containers/GetBeacon';
import Onboarding from '#containers/Onboarding';
import PolicyWebView from '#containers/PolicyWebView';
import ReasonCreator from '#containers/ReasonCreator';
import ReasonStatement from '#containers/ReasonStatement';
import ScheduleHistory from '#containers/ScheduleHistory';
import SdkTest from '#containers/SdkTest';
import SelectAcademy from '#containers/SelectAcademy';
import SignIn from '#containers/SignIn';
import SignUp from '#containers/SignUp';
import UpdatePassword from '#containers/UpdatePassword';
import UpdateUserInfo from '#containers/UpdateUserInfo';
import UserWithdraw from '#containers/UserWithdraw';
import {useGetAppVersions} from '#hooks/useUser.ts';
import TabNavigation from '#navigation/TabNavigation';
import GlobalState from '#recoil/Global';
import {onesignalInit} from '#utils/onesignalHelper.ts';
import {clearStorage, getStorageItem, storage} from '#utils/storageHelper.ts';
import {isVersionLower} from '#utils/versionHelper.ts';

const RootStack = createNativeStackNavigator();

const screenOptions = {headerShown: false};

const RootStackNavigation = ({
  navigationIntegration,
}: {
  navigationIntegration: {registerNavigationContainer: (navigationContainerRef: unknown) => void};
}) => {
  const [isLogin, setIsLogin] = useRecoilState(GlobalState.isLoginState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  const routeNameRef = useRef<string>();
  const navigationRef = useNavigationContainerRef();

  const {appVersions} = useGetAppVersions();

  const handleOnReady = () => {
    navigationIntegration.registerNavigationContainer(navigationRef); // for sentry
    routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name ?? '';

    BootSplash.hide({fade: true}).then();
  };

  useEffect(() => {
    // 앱 실행 시 토큰 리프레시
    if (getStorageItem(ACCESS_TOKEN)) {
      tokenRefresh().then();
    }
  }, []);

  useEffect(() => {
    // 앱 최소 버전 확인
    const minVersion = IS_IOS ? appVersions?.APP_VERSION_IOS : appVersions?.APP_VERSION_ANDROID;
    const isLower = isVersionLower({current: APP_VERSION, minVersion: minVersion ?? '1.2.0'});
    if (isLower) {
      setModalState({
        isVisible: true,
        title: '안내',
        message: '더 나은 성능과 안정성을 위해 앱을 업데이트해 주세요.',
        children: <OpenStore />,
        hideButtons: true,
      });
      return;
    }

    // 초기화
    onesignalInit();

    // mmkv storage listener
    const storageListener = storage.addOnValueChangedListener(changedKey => {
      const newValue = getStorageItem(changedKey);
      if (changedKey === ACCESS_TOKEN && newValue === TOKEN_ERROR) {
        clearStorage();
        setModalState({
          isVisible: true,
          title: '안내',
          message: '세션이 만료되었습니다. 다시 로그인해주세요.',
        });
        setIsLogin(false);
      }
    });

    return () => {
      storageListener.remove();
    };
  }, [appVersions]);

  return (
    <NavigationContainer ref={navigationRef} onReady={() => handleOnReady()}>
      <RootStack.Navigator screenOptions={screenOptions}>
        {!isLogin ? (
          <>
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
            <RootStack.Screen name="UpdatePhone" component={UpdateUserInfo} />
            <RootStack.Screen name="UserWithdraw" component={UserWithdraw} />
            <RootStack.Screen name="CustomerService" component={CustomerService} />
            <RootStack.Screen name="PolicyWebView" component={PolicyWebView} />
            <RootStack.Screen name="GetBeacon" component={GetBeacon} />
            <RootStack.Screen name="SdkTest" component={SdkTest} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackNavigation;
