import {useState} from 'react';
import {Alert, Platform} from 'react-native';
import Config from 'react-native-config';

import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';
import moment from 'moment/moment';

import CButton from '#components/common/CommonButton/CButton.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import {CustomScrollView} from '#components/common/CustomScrollComponents';
import Header from '#components/common/Header/Header.tsx';
import {ACCESS_TOKEN, APP_VERSION, BEACON_UUID} from '#constants/common.ts';
import {checkLocationPermissions, checkPhonePermissions} from '#permissions/index.ts';
import {getDeviceUUID} from '#utils/common.ts';
import {getStorageItem} from '#utils/storageHelper.ts';

import NativeSDKScanner from '../../specs/NativeSDKScanner.ts';

const SdkTest = ({navigation}: {navigation: NativeStackNavigationHelpers}) => {
  const [pressTimes, setPressTimes] = useState<number>(0);
  const [show, setShow] = useState<boolean>(false);

  const surprise = () => {
    if (pressTimes === 5) {
      setShow(true);
    } else {
      Alert.alert('👾');
      setPressTimes(pressTimes + 1);
    }
  };

  const onPressTest = async (type: number) => {
    switch (type) {
      case 0: {
        const result = await NativeSDKScanner.bluetoothFeatureEnabled();
        console.log(`enabled: ${result.isEnabled} / feature: ${result.isFeature}`);
        break;
      }
      case 1: {
        NativeSDKScanner.scannerInitialize({
          isWifiEnable: true,
          isCellEnable: true,
          isLocationEnable: true,
          isBeaconEnable: true,
          beaconTTL: 30,
          beaconFilter: BEACON_UUID,
        });
        break;
      }
      case 2: {
        const value = NativeSDKScanner.scannerIsInitialized();
        console.log('Is Init:', value);
        break;
      }
      case 3: {
        NativeSDKScanner.scannerDestroy();
        break;
      }
      case 4: {
        const value = NativeSDKScanner.beaconScannerIsRunning();
        console.log('isRunning:', value);
        break;
      }
      case 5: {
        NativeSDKScanner.getLocation()
          .then(val => {
            console.log('RN LOCATION:', val);
          })
          .catch((err: Error) => {
            console.log('RN LOCATION ERROR', err);
          });
        break;
      }
      case 6: {
        NativeSDKScanner.getBeacons().then(val => {
          console.log('RN BEACON:', val);
        });
        break;
      }
      case 7: {
        NativeSDKScanner.getWifis().then(val => {
          console.log('RN Wifis:', val);
        });
        break;
      }
      case 8: {
        NativeSDKScanner.getCells().then(val => {
          console.log('RN Cells:', val);
        });
        break;
      }
      case 9: {
        const uuid = await getDeviceUUID();
        const locationPermission = await checkLocationPermissions();
        const phonePermission = await checkPhonePermissions();
        await NativeSDKScanner.startEscapeCheck({
          baseUrl: Config.BASE_URL,
          token: getStorageItem(ACCESS_TOKEN) ?? 'NO_TOKEN',
          stickyme_uuid: uuid ?? 'NO_UUID',
          sticky_version: APP_VERSION,
          sticky_os: `${Platform.OS} ${Platform.Version}`,
          sticky_location_permit: locationPermission,
          sticky_phone_permit: phonePermission,
          scheduleId: 'TEST',
          intervalSeconds: 20,
          // endTime: moment().add(20, 'seconds').unix(),
          endTime: moment().add(2, 'minutes').unix(),
        });
        break;
      }
    }
  };

  return (
    <CSafeAreaView>
      <Header title="데이터 수집" isBack navigation={navigation} />
      <CView>
        <CustomScrollView>
          {show ? (
            <CButton text="😶‍🌫️" onPress={() => surprise()} />
          ) : (
            <>
              <CButton text="bluetoothFeatureEnabled" onPress={() => onPressTest(0)} />
              <CButton text="Init" onPress={() => onPressTest(1)} />
              <CButton text="isInit" onPress={() => onPressTest(2)} />
              <CButton text="scannerDestroy" onPress={() => onPressTest(3)} />
              <CButton text="beaconScannerIsRunning" onPress={() => onPressTest(4)} />
              <CButton text="getLocation" onPress={() => onPressTest(5)} />
              <CButton text="getBeacons" onPress={() => onPressTest(6)} />
              <CButton text="getWifis" onPress={() => onPressTest(7)} />
              <CButton text="getCells" onPress={() => onPressTest(8)} />
              <CButton text="자동이탈체크(30초/5분)" onPress={() => onPressTest(9)} />
            </>
          )}
        </CustomScrollView>
      </CView>
    </CSafeAreaView>
  );
};

export default SdkTest;
