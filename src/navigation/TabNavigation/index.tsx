import React, {useEffect, useState} from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSetRecoilState} from 'recoil';

import TabBar from '#components/Navigation/TabBar.tsx';
import DailySchedule from '#containers/DailySchedules';
import ScheduleHistory from '#containers/ScheduleHistory';
import Settings from '#containers/Settings';
import WeeklySchedules from '#containers/WeeklySchedules';
import {useGetCheckUuid, useGetUserInfo} from '#hooks/useUser.ts';
import GlobalState from '#recoil/Global';
import {
  requestAddBeaconListener,
  requestBeaconScanList,
  requestRemoveBeaconListener,
  requestStartBeaconScanning,
  requestStopBeaconScanning,
} from '#services/beaconScanner.ts';
import {requestWifiList} from '#services/locationScanner.ts';
import {commonStyles, getDeviceUUID} from '#utils/common.ts';
import {onesignalLogin} from '#utils/onesignalHelper.ts';
import {
  requestLocationPermissions,
  requestNotificationsPermission,
} from '#utils/permissionsHelper.ts';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const [deviceUuid, setDeviceUuid] = useState<string>();

  const setModalState = useSetRecoilState(GlobalState.globalModalState);
  const setWifiState = useSetRecoilState(GlobalState.wifiState);
  const setBeaconState = useSetRecoilState(GlobalState.beaconState);

  const {userData} = useGetUserInfo();
  const {uuidCheckedList} = useGetCheckUuid(deviceUuid);

  const tabOptions = {headerShown: false};

  useEffect(() => {
    getDeviceUUID().then(uuid => {
      setDeviceUuid(uuid);
    });
  }, []);

  useEffect(() => {
    const list = uuidCheckedList?.map(academy => academy.name);
    if (list.length) {
      setModalState({
        isVisible: true,
        title: '기기 변경 안내',
        message: `${list?.join(', ')}에서는\n기기 변경 시 초기화 후 출결이 가능합니다.\n자세한 내용은 기관에 문의해 주세요.`,
      });
    }
  }, [uuidCheckedList]);

  useEffect(() => {
    (async () => {
      await requestNotificationsPermission();
      const isAllGranted = await requestLocationPermissions();
      if (isAllGranted) {
        // wi-fi, beacon 값
        await requestStartBeaconScanning().then(result => {
          if (!result) {
            return;
          }
          requestAddBeaconListener(beacon => {});
        });
        await requestWifiList().then(wifi => {
          setWifiState(wifi ?? []);
        });
        await requestBeaconScanList().then(beacon => {
          setBeaconState(beacon ?? []);
        });
      }
    })();
    return () => {
      requestStopBeaconScanning().then();
      requestRemoveBeaconListener();
    };
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
        tabBarIcon: ({focused}) => {
          return <TabBar routeName={route.name} focused={focused} />;
        },
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
