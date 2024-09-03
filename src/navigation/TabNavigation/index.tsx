import React, {useEffect} from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useRecoilValue, useSetRecoilState} from 'recoil';

import TabBar from '#components/Navigation/TabBar.tsx';
import DailySchedule from '#containers/DailySchedules';
import ScheduleHistory from '#containers/ScheduleHistory';
import Settings from '#containers/Settings';
import WeeklySchedules from '#containers/WeeklySchedules';
import globalState from '#recoil/Global';
import userState from '#recoil/User';
import {
  requestAddBeaconListener,
  requestBeaconScanList,
  requestRemoveBeaconListener,
  requestStartBeaconScanning,
  requestStopBeaconScanning,
} from '#services/beaconScanner.ts';
import {requestWifiList} from '#services/locationScanner.ts';
import {onesignalLogin} from '#utils/onesignalHelper.ts';
import {
  requestLocationPermissions,
  requestNotificationsPermission,
} from '#utils/permissionsHelper.ts';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const setWifiState = useSetRecoilState(globalState.wifiState);
  const setBeaconState = useSetRecoilState(globalState.beaconState);
  const userData = useRecoilValue(userState.userInfoState);

  const tabOptions = {headerShown: false};

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
    if (userData) {
      onesignalLogin(userData.userId, userData.settingPushApp).then();
    }
  }, [userData]);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          return <TabBar routeName={route.name} focused={focused} />;
        },
        tabBarStyle: {height: 80, paddingHorizontal: 20, paddingVertical: 15},
        tabBarShowLabel: false,
      })}>
      <Tab.Screen
        name="scheduleHistory"
        component={ScheduleHistory}
        options={tabOptions}
      />
      <Tab.Screen
        name="dailySchedules"
        component={DailySchedule}
        options={tabOptions}
      />
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
