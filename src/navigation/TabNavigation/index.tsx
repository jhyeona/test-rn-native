import React, {useEffect} from 'react';
import Schedule from '../../containers/Schedule';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Mypage from '../../containers/Mypage';
import SvgIcon from '../../components/common/Icon/Icon.tsx';
import {
  requestLocationPermissions,
  requestNotificationsPermission,
} from '../../utils/permissionsHelper.ts';
import {useSetRecoilState} from 'recoil';
import globalState from '../../recoil/Global';
import {
  requestAddBeaconListener,
  requestBeaconScanList,
  requestRemoveBeaconListener,
  requestStartBeaconScanning,
  requestStopBeaconScanning,
} from '../../services/beaconScanner.ts';
import {requestWifiList} from '../../services/locationScanner.ts';
const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const setWifiState = useSetRecoilState(globalState.wifiState);
  const setBeaconState = useSetRecoilState(globalState.beaconState);

  useEffect(() => {
    (async () => {
      await requestNotificationsPermission();
      const isAllGranted = await requestLocationPermissions();
      if (isAllGranted) {
        // wifi, beacon 값
        await requestStartBeaconScanning().then(result => {
          if (!result) {
            console.log('비콘 스캔 실패');
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
        // await checkDeviceFeature().then(async ([beaconEnabler]) => {
        //   if (beaconEnabler) {
        //   }
        // });
      }
    })();
    return () => {
      requestStopBeaconScanning().then();
      requestRemoveBeaconListener();
    };
  }, []);

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
