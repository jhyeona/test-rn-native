import React, {useEffect, useRef} from 'react';
import {
  NavigationContainer,
  useNavigation,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from '../../containers/SignIn';
import TabNavigation from '../TabNavigation';
import {logFBScreenView} from '../../utils/firebaseLogHelper.ts';
import SignUp from '../../containers/SignUp';
import FindPassword from '../../containers/FindPassword';
import BootSplash from 'react-native-bootsplash';
import {useRecoilState} from 'recoil';
import globalState from '../../recoil/Global';
import {storage} from '../../utils/storageHelper.ts';
import {useMMKVListener} from 'react-native-mmkv';
import LectureDetail from '../../containers/LectureDetail/index.tsx';
import ScheduleHistory from '../../containers/ScheduleHistory';
import Initialize from '../../containers/Initialize';

const RootStack = createNativeStackNavigator();

const RootStackNavigation = () => {
  const navigationRef = useNavigationContainerRef();
  const [isLogin, setIsLogin] = useRecoilState(globalState.isLoginState);
  const routeNameRef = useRef<string>();

  const handleOnReady = () => {
    routeNameRef.current =
      navigationRef?.current?.getCurrentRoute()?.name ?? '';
    BootSplash.hide({fade: true}).then();
  };

  const handleOnStateChange = async () => {
    // connected Firebase
    const previousRouteName = routeNameRef.current;
    const currentRouteName: string =
      navigationRef?.current?.getCurrentRoute()?.name ?? '';

    if (previousRouteName !== currentRouteName) {
      await logFBScreenView(currentRouteName, currentRouteName);
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
        {!isLogin ? (
          <>
            <RootStack.Screen
              name="SignIn"
              component={SignIn}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name="SignUp"
              component={SignUp}
              options={{headerTitle: ''}}
            />
            <RootStack.Screen
              name="FindPassword"
              component={FindPassword}
              options={{headerTitle: ''}}
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
              options={{headerTitle: '강의 상세'}}
            />
            <RootStack.Screen
              name="ScheduleHistory"
              component={ScheduleHistory}
              options={{headerTitle: '내 출석 기록'}}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackNavigation;
