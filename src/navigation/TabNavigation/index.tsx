import React, {useEffect} from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import Schedule from '#containers/Schedule';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Mypage from '#containers/Mypage';
import SvgIcon from '#components/common/Icon/Icon.tsx';
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
      screenOptions={({route}) => ({
        tabBarIcon: ({color}) => {
          //props: focused, size
          if (route.name === 'Schedule') {
            return <SvgIcon name="Home" size={23} color={color} />;
          }
          if (route.name === 'Mypage') {
            return <SvgIcon name="Setting" size={29} color={color} />;
          }
        },
        tabBarShowLabel: false,
      })}>
      <Tab.Screen
        name="Schedule"
        component={Schedule}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Mypage"
        component={Mypage}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
