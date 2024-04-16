import React, {useEffect} from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import Schedule from '#containers/Schedule';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Mypage from '#containers/Mypage';
import {
  requestLocationPermissions,
  requestNotificationsPermission,
} from '#utils/permissionsHelper.ts';
import globalState from '#recoil/Global';
import {
  requestAddBeaconListener,
  requestBeaconScanList,
  requestRemoveBeaconListener,
  requestStartBeaconScanning,
  requestStopBeaconScanning,
} from '#services/beaconScanner.ts';
import {requestWifiList} from '#services/locationScanner.ts';
import {onesignalLogin} from '#utils/onesignalHelper.ts';
import userState from '#recoil/User';
import ScheduleHistory from '#containers/ScheduleHistory';
import Lecture from '#containers/Lecture';
import TabBar from '#components/Navigation/TabBar.tsx';
const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const setWifiState = useSetRecoilState(globalState.wifiState);
  const setBeaconState = useSetRecoilState(globalState.beaconState);
  const userData = useRecoilValue(userState.userInfoState);

  useEffect(() => {
    (async () => {
      await requestNotificationsPermission();
      const isAllGranted = await requestLocationPermissions();
      if (isAllGranted) {
        // wifi, beacon 값
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
      onesignalLogin(userData.userId, userData.settingPushApp);
    }
  }, [userData]);

  return (
    <Tab.Navigator
      // tabBar={(props) => <TabBar {...props} />}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          return <TabBar routeName={route.name} focused={focused} />;
        },
        tabBarStyle: {paddingHorizontal: 20, paddingVertical: 10},
        tabBarShowLabel: false,
      })}>
      <Tab.Screen
        name="Schedule"
        component={Schedule}
        options={{headerShown: false}}
      />
      {/*<Tab.Screen*/}
      {/*  name="ScheduleHistory"*/}
      {/*  component={ScheduleHistory}*/}
      {/*  options={{headerShown: false}}*/}
      {/*/>*/}
      {/*<Tab.Screen*/}
      {/*  name="Lecture"*/}
      {/*  component={Lecture}*/}
      {/*  options={{headerShown: false}}*/}
      {/*/>*/}
      <Tab.Screen
        name="Mypage"
        component={Mypage}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
