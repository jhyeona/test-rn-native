import React, {useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';

import {UseMutateAsyncFunction} from '@tanstack/react-query';
import {useRecoilState, useSetRecoilState} from 'recoil';

import CButton from '#components/common/CommonButton/CButton.tsx';
import {APP_VERSION, IS_ANDROID} from '#constants/common.ts';
import BtnScheduleAttendInfo from '#containers/DailySchedules/components/BtnScheduleAttendInfo.tsx';
import {
  useGetScheduleHistory,
  useReqAttend,
  useReqComeback,
  useReqComplete,
  useReqEnter,
  useReqLeave,
} from '#containers/DailySchedules/hooks/useApi.ts';
import {useGetAttendeeId} from '#containers/DailySchedules/hooks/useSchedules.ts';
import GlobalState from '#recoil/Global';
import {
  requestAddBeaconListener,
  requestBeaconScanList,
  requestStartBeaconScanning,
} from '#services/beaconScanner.ts';
import {errorToCrashlytics, setAttToCrashlytics} from '#services/firebase.ts';
import {
  requestGetLocationInfo,
  requestWifiList,
} from '#services/locationScanner.ts';
import {CommonResponseProps} from '#types/common.ts';
import {
  PostEventProps,
  ScheduleDefaultProps,
  ScheduleHistoryDataProps,
} from '#types/schedule.ts';
import {getDeviceUUID} from '#utils/common.ts';
import {validBeaconList, validWifiList} from '#utils/locationHelper.ts';
import {
  handleOpenSettings,
  requestLocationPermissions,
} from '#utils/permissionsHelper.ts';

const BUTTON_HEIGHT = 28;
const BtnSchedule = ({
  scheduleData,
  isBtnAvailable,
  isAllowedAfterEnd,
}: {
  scheduleData?: ScheduleDefaultProps;
  isBtnAvailable: boolean;
  isAllowedAfterEnd: boolean;
}) => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setGlobalModalState = useSetRecoilState(GlobalState.globalModalState);
  const [beaconState, setBeaconState] = useRecoilState(GlobalState.beaconState);
  const [wifiState, setWifiState] = useRecoilState(GlobalState.wifiState);
  const [isPermissions, setIsPermissions] = useState(false);
  const [isAttendTime, setIsAttendTime] = useState(false);

  const {reqEnterEvent} = useReqEnter();
  const {reqCompleteEvent} = useReqComplete();
  const {reqLeaveEvent} = useReqLeave();
  const {reqComebackEvent} = useReqComeback();
  const {reqAttendEvent} = useReqAttend();

  const attendeeId = useGetAttendeeId();
  const {historyData, refetchHistoryData} = useGetScheduleHistory({
    attendeeId: attendeeId,
    scheduleId: scheduleData?.scheduleId,
  });

  const permissionGranted = async () => {
    const grantedResult = await requestLocationPermissions();
    setIsPermissions(grantedResult);
    if (!grantedResult) {
      setGlobalModalState({
        isVisible: true,
        title: '권한 설정 안내',
        message: `출결을 위해 ${
          IS_ANDROID ? '위치와 근처기기' : '정확한 위치'
        } 권한이 필요합니다. \n확인을 누르시면 설정으로 이동합니다.`,
        isConfirm: true,
        onPressConfirm: () => handleOpenSettings(),
      });
      return false;
    }
    return true;
  };

  const eventPayload = async (): Promise<PostEventProps> => {
    // BEACON
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
    const beaconListData = beaconList.map(beaconItem => {
      return {
        uuid: beaconItem.uuid,
        major: beaconItem.major,
        minor: beaconItem.minor,
        rssi: beaconItem.rssi,
      };
    });

    // WIFI
    let wifiList = wifiState;
    const isWifiValid = validWifiList(wifiState);
    if (!isWifiValid) {
      await requestWifiList().then(wifi => {
        wifiList = wifi;
        setWifiState(wifi ?? []);
      });
    }
    const wifiListData = wifiList.map(wifiItem => {
      return {
        ssid: wifiItem.ssid,
        bssid: wifiItem.bssid,
        rssi: wifiItem.rssi,
      };
    });

    // Location
    const locationData = await requestGetLocationInfo();

    // device Id
    const deviceId = await getDeviceUUID();
    // 출석 체크 payload
    return {
      attendeeId: attendeeId,
      scheduleId: scheduleData?.scheduleId ?? '',
      deviceInfo: deviceId,
      os: `${Platform.OS} ${Platform.Version}`,
      appVersion: APP_VERSION,
      latitude: locationData?.latitude ?? 0.1,
      longitude: locationData?.longitude ?? 0.1,
      altitude: locationData?.altitude ?? 0.1,
      wifis: wifiListData,
      bles: beaconListData,
    };
  };

  // 이벤트 요청 공통 함수
  const handleEvent = async (
    requestEvent: UseMutateAsyncFunction<
      ScheduleHistoryDataProps,
      CommonResponseProps<null>,
      PostEventProps,
      void
    >,
    eventName: string,
  ) => {
    setIsLoading(true);
    const permissionsCheck = await permissionGranted();
    if (!permissionsCheck) return;
    const payload = await eventPayload();
    payload.locationPermit = permissionsCheck;
    try {
      await requestEvent(payload);
      await refetchHistoryData();
    } catch (e: any) {
      console.log('req enter error', e);
      await setAttToCrashlytics({...payload, permission: isPermissions});
      errorToCrashlytics(e, eventName);
    } finally {
      setIsLoading(false);
    }
  };

  const onPressEnter = async () => {
    const isEntered = !!historyData?.enterEvent;
    if (isEntered && isAttendTime) {
      await handleEvent(reqAttendEvent, 'requestEventAttend');
      return;
    }
    await handleEvent(reqEnterEvent, 'requestEventEnter');
  };

  const onPressComplete = async () => {
    setGlobalModalState({
      isVisible: true,
      title: '안내',
      message: '퇴실하시겠습니까?',
      isConfirm: true,
      onPressConfirm: () =>
        handleEvent(reqCompleteEvent, 'requestEventComplete'),
    });
  };

  const onPressLeave = () => {
    setGlobalModalState({
      isVisible: true,
      title: '안내',
      message: '외출하시겠습니까?',
      isConfirm: true,
      onPressConfirm: () => handleEvent(reqLeaveEvent, 'requestEventLeave'),
    });
  };

  const onPressComeback = () => {
    setGlobalModalState({
      isVisible: true,
      title: '안내',
      message: '외출 종료하시겠습니까?',
      isConfirm: true,
      onPressConfirm: () =>
        handleEvent(reqComebackEvent, 'requestEventComeback'),
    });
  };

  return (
    <>
      {isBtnAvailable && !historyData?.completeEvent && (
        <>
          <View style={styles.checkButtons}>
            <CButton
              text="출석"
              onPress={onPressEnter}
              buttonStyle={[styles.checkButton, styles.buttonCommon]}
              disabled={
                !!historyData?.completeEvent ||
                !isAttendTime ||
                isAllowedAfterEnd
              }
              fontSize={12}
              noMargin
            />
            <CButton
              text="퇴실"
              onPress={onPressComplete}
              buttonStyle={[styles.checkButton, styles.buttonCommon]}
              disabled={
                !historyData?.enterEvent || !!historyData?.completeEvent
              }
              fontSize={12}
              noMargin
            />
          </View>
          {!historyData?.completeEvent && (
            <CButton
              text={historyData?.isLeaved ? '외출 종료' : '외출 시작'}
              onPress={historyData?.isLeaved ? onPressComeback : onPressLeave}
              buttonStyle={styles.buttonCommon}
              fontSize={12}
              whiteButton={historyData?.isLeaved}
              noMargin
              disabled={!historyData?.enterEvent || isAllowedAfterEnd}
            />
          )}
        </>
      )}
      {/* 시간별 출결일 경우 */}
      {scheduleData?.scheduleTimeList?.length && (
        <BtnScheduleAttendInfo
          scheduleData={scheduleData}
          setIsEnter={setIsAttendTime}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  buttonCommon: {
    height: BUTTON_HEIGHT,
  },
  checkButtons: {
    display: 'flex',
    flexDirection: 'row',
    gap: 6,
  },
  checkButton: {
    flex: 0.5,
  },
});
export default BtnSchedule;
