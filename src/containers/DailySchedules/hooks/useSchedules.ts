import {useCallback} from 'react';
import {Platform} from 'react-native';

import {useRecoilState, useRecoilValue} from 'recoil';

import {APP_VERSION} from '#constants/common.ts';
import {useGetUserInfo} from '#hooks/useUser.ts';
import GlobalState from '#recoil/Global';
import {
  requestAddBeaconListener,
  requestBeaconScanList,
  requestStartBeaconScanning,
} from '#services/beaconScanner.ts';
import {
  requestGetLocationInfo,
  requestWifiList,
} from '#services/locationScanner.ts';
import {PostEventProps} from '#types/schedule.ts';
import {getDeviceUUID} from '#utils/common.ts';
import {validBeaconList, validWifiList} from '#utils/locationHelper.ts';

// 현재 선택된 기관에 등록된 학생 정보
export const useGetAttendeeId = () => {
  const selectAcademyId = useRecoilValue(GlobalState.selectedAcademy);
  const {userData} = useGetUserInfo();

  const attendee = userData?.studentList.filter(val => {
    return val.academy.academyId === selectAcademyId;
  });
  return attendee?.[0]?.attendeeId ?? '';
};

// 출석 시 필요한 payload 데이터
export const useEventPayload = () => {
  const [beaconState, setBeaconState] = useRecoilState(GlobalState.beaconState);
  const [wifiState, setWifiState] = useRecoilState(GlobalState.wifiState);

  return useCallback(
    async (attendeeId: string, scheduleId: string): Promise<PostEventProps> => {
      // BEACON 처리
      let beaconList = validBeaconList(beaconState);
      if (beaconList.length === 0) {
        const result = await requestStartBeaconScanning();
        if (result) {
          requestAddBeaconListener();
        }
        const beacon = await requestBeaconScanList();
        beaconList = beacon ? validBeaconList(beacon) : [];
        setBeaconState(beaconList);
      }
      const beaconListData = beaconList.map(beaconItem => ({
        uuid: beaconItem.uuid,
        major: beaconItem.major,
        minor: beaconItem.minor,
        rssi: beaconItem.rssi,
      }));

      // WIFI 처리
      let wifiList = wifiState;
      const isWifiValid = validWifiList(wifiState);
      if (!isWifiValid) {
        const wifi = await requestWifiList();
        wifiList = wifi ?? [];
        setWifiState(wifiList);
      }
      const wifiListData = wifiList.map(wifiItem => ({
        ssid: wifiItem.ssid,
        bssid: wifiItem.bssid,
        rssi: wifiItem.rssi,
      }));

      // 위치 정보 처리
      const locationData = await requestGetLocationInfo();

      // Device ID 처리
      const deviceId = await getDeviceUUID();

      // 출석 체크 payload 생성
      return {
        attendeeId,
        scheduleId,
        deviceInfo: deviceId,
        os: `${Platform.OS} ${Platform.Version}`,
        appVersion: APP_VERSION,
        latitude: locationData?.latitude ?? 0.1,
        longitude: locationData?.longitude ?? 0.1,
        altitude: locationData?.altitude ?? 0.1,
        wifis: wifiListData,
        bles: beaconListData,
      };
    },
    [beaconState, setBeaconState, wifiState, setWifiState],
  );
};
