// FOR DEV
import {useState} from 'react';
import {Alert, View} from 'react-native';

import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';
import {useSetRecoilState} from 'recoil';

import CButton from '#components/common/CommonButton/CButton.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView';
import CView from '#components/common/CommonView/CView.tsx';
import {CustomFlatList} from '#components/common/CustomScrollComponents';
import CText from '#components/common/CustomText/CText.tsx';
import Header from '#components/common/Header/Header.tsx';
import {COLORS} from '#constants/colors.ts';
import GlobalState from '#recoil/Global';
import {BeaconProps, WifiProps} from '#types/location.ts';
import {bluetoothFeatureEnabled, getBeacons, getWifis} from '#utils/stickySdkHelper.ts';

const GroupText = ({text, value}: {text: string; value: string}) => {
  return (
    <View style={{paddingTop: 5, flexDirection: 'row'}}>
      <CText
        text={text}
        fontWeight="700"
        color={COLORS.placeholder}
        fontSize={16}
        style={{width: 70}}
      />
      <CText text={value} fontSize={16} />
    </View>
  );
};

const GetBeacon = ({navigation}: {navigation: NativeStackNavigationHelpers}) => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const [isBeacon, setIsBeacon] = useState<null | boolean>(null);
  const [beaconList, setBeaconList] = useState<BeaconProps[]>([]);
  const [wifiList, setWifiLIst] = useState<WifiProps[]>([]);

  const onPressGetBeacon = async () => {
    setIsLoading(true);
    setIsBeacon(true);
    try {
      await bluetoothFeatureEnabled();
      const beacon = await getBeacons();
      setBeaconList(beacon ?? []);
    } catch (error) {
      Alert.alert(`⚠️ 오류 : ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onPressGetWifi = async () => {
    setIsLoading(true);
    setIsBeacon(false);
    try {
      const wifi = await getWifis();
      setWifiLIst(wifi ?? []);
    } catch (error) {
      Alert.alert(`⚠️ 오류 : ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBeaconItem = ({item}: {item: BeaconProps}) => {
    return (
      <View
        key={`beaconList-${item.uuid}-${item.timestamp}`}
        style={{borderBottomWidth: 1, borderColor: COLORS.layout, paddingVertical: 10}}>
        <CText text={item.uuid} fontWeight="700" fontSize={18} color={COLORS.primary} />
        <GroupText text="major" value={item.major} />
        <GroupText text="minor" value={item.minor} />
        <GroupText text="mac" value={item.mac} />
        <GroupText text="rssi" value={item.rssi.toString()} />
        <GroupText text="accuracy" value={item.accuracy.toString()} />
        <GroupText text="proximity" value={item.proximity.toString()} />
        <GroupText text="수집시간" value={new Date(item.timestamp).toLocaleString()} />
      </View>
    );
  };

  const renderWifiItem = ({item, index}: {item: WifiProps; index: number}) => {
    return (
      <View
        key={`WifiList-${item.timestamp}`}
        style={{borderBottomWidth: 1, borderColor: COLORS.layout, paddingVertical: 10}}>
        <CText text={`WIFI ${index + 1}`} fontWeight="700" fontSize={18} color={COLORS.primary} />
        <GroupText text="ssid" value={item.ssid} />
        <GroupText text="bssid" value={item.bssid} />
        <GroupText text="rssi" value={item.rssi.toString()} />
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <Header title="데이터 수집" isBack navigation={navigation} />
      <CView>
        <View style={{flexDirection: 'row', gap: 5}}>
          <CButton
            text="BEACON"
            onPress={onPressGetBeacon}
            buttonStyle={{flex: 0.5}}
            fontSize={20}
            whiteButton={isBeacon === null || !isBeacon}
          />
          <CButton
            text="WIFI"
            onPress={onPressGetWifi}
            buttonStyle={{flex: 0.5}}
            fontSize={20}
            whiteButton={isBeacon === null || isBeacon}
          />
        </View>
        {!beaconList.length && !wifiList.length && (
          <CText
            text="🐣 데이터가 없어용 🐣"
            fontSize={18}
            style={{textAlign: 'center', marginTop: 50}}
          />
        )}
        {isBeacon ? (
          <CustomFlatList data={beaconList} renderItem={renderBeaconItem} />
        ) : (
          <CustomFlatList data={wifiList} renderItem={renderWifiItem} />
        )}
      </CView>
    </CSafeAreaView>
  );
};

export default GetBeacon;
