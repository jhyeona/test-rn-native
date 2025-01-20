import React, {useEffect, useState} from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSetRecoilState} from 'recoil';

import TabBar from '#components/Navigation/TabBar.tsx';
import DailySchedule from '#containers/DailySchedules';
import {useGetAttendeeInfo} from '#containers/DailySchedules/hooks/useSchedules.ts';
import ScheduleHistory from '#containers/ScheduleHistory';
import Settings from '#containers/Settings';
import WeeklySchedules from '#containers/WeeklySchedules';
import {useSentrySetUser} from '#hooks/useSentry.ts';
import {useGetCheckUuid, useGetUserInfo} from '#hooks/useUser.ts';
import {
  requestLocationPermissions,
  requestNotificationsPermission,
  requestPhonePermission,
} from '#permissions/index.ts';
import GlobalState from '#recoil/Global';
import {sentryCaptureException} from '#services/sentry.ts';
import {commonStyles, getDeviceUUID} from '#utils/common.ts';
import {bluetoothFeatureEnabled, initScanner} from '#utils/stickySdkHelper.ts';
import {onesignalLogin} from '#utils/onesignalHelper.ts';

const Tab = createBottomTabNavigator();
const tabOptions = {headerShown: false};

const TabNavigation = () => {
  const [deviceUuid, setDeviceUuid] = useState<string>();

  const setToastState = useSetRecoilState(GlobalState.globalToastState);
  const setWifiState = useSetRecoilState(GlobalState.wifiState);
  const setBeaconState = useSetRecoilState(GlobalState.beaconState);

  const {userData} = useGetUserInfo();
  const {uuidCheckedList} = useGetCheckUuid(deviceUuid);
  const {selectedAcademyUseEscapeCheck, beaconFilter} = useGetAttendeeInfo();

  useSentrySetUser({userData});

  useEffect(() => {
    getDeviceUUID().then(uuid => {
      setDeviceUuid(uuid);
    });
  }, []);

  useEffect(() => {
    try {
      const list = uuidCheckedList?.map(academy => academy.name);
      if (list.length > 0) {
        setToastState({
          isVisible: true,
          message: `${list?.join(', ')}에서는\n기기 변경 시 초기화 후 출결이 가능합니다.\n자세한 내용은 기관에 문의해 주세요.`,
          time: 6000,
        });
      }
    } catch (error) {
      sentryCaptureException({
        error,
        payload: {userId: userData?.userId},
        eventName: 'uuidCheckedList',
        level: 'log',
      });
    }
  }, [uuidCheckedList]);

  useEffect(() => {
    (async () => {
      await requestNotificationsPermission();
      const isAllGranted = await requestLocationPermissions();
      if (!isAllGranted) return;

      // 블루투스 지원하지 않으면 동작시키지 않음
      const {isFeature} = await bluetoothFeatureEnabled();
      if (!isFeature) return;
      if (selectedAcademyUseEscapeCheck) {
        // 자동이탈체크 활성화된 경우 phone 권한 확인
        await requestPhonePermission();
      }

      // [SDK] INIT
      initScanner({isCellEnable: selectedAcademyUseEscapeCheck, beaconFilter});
    })();
  }, [setBeaconState, setWifiState]);

  useEffect(() => {
    (async () => {
      if (userData) {
        await onesignalLogin(userData.userId);
      }
    })();
  }, [userData]);

  return (
    <Tab.Navigator
      initialRouteName="dailySchedules"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => TabBar({routeName: route.name, focused: focused}), // 함수 사용으로 매번 리렌더링되지 않도록 최적화
        tabBarStyle: commonStyles.tabBarStyle,
        tabBarShowLabel: false,
      })}>
      <Tab.Screen name="scheduleHistory" component={ScheduleHistory} options={tabOptions} />
      <Tab.Screen name="dailySchedules" component={DailySchedule} options={tabOptions} />
      <Tab.Screen
        name="weeklySchedules"
        component={WeeklySchedules}
        options={{headerShown: false}}
      />
      <Tab.Screen name="settings" component={Settings} options={tabOptions} />
    </Tab.Navigator>
  );
};

export default TabNavigation;
