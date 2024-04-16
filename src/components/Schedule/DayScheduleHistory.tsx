import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import moment from 'moment';
import {
  GetScheduleHistoryProps,
  PostEventProps,
  ScheduleDefaultProps,
  ScheduleTimeProps,
} from '#types/schedule.ts';
import {COLORS} from '#constants/colors.ts';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import CButton from '#components/common/CommonButton/CButton.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import {
  postEventAttend,
  postEventComeback,
  postEventComplete,
  postEventEnter,
  postEventLeave,
  useGetScheduleHistory,
} from '#hooks/useSchedule.ts';
import {useRecoilState, useSetRecoilState} from 'recoil';
import globalState from '#recoil/Global';
import {
  handleOpenSettings,
  requestLocationPermissions,
} from '#utils/permissionsHelper.ts';
import {IS_ANDROID} from '#constants/common.ts';
import {validBeaconList, validWifiList} from '#utils/locationHelper.ts';
import {
  requestAddBeaconListener,
  requestBeaconScanList,
  requestStartBeaconScanning,
} from '#services/beaconScanner.ts';
import {
  requestGetLocationInfo,
  requestWifiList,
} from '#services/locationScanner.ts';
import {errorToCrashlytics, setAttToCrashlytics} from '#services/firebase.ts';
import {
  attendList,
  handleErrorResponse,
  isBetween,
} from '#utils/scheduleHelper.ts';
import LightButton from '#components/Schedule/LightButton.tsx';

interface Props {
  scheduleHistoryPayload: GetScheduleHistoryProps;
  schedule: ScheduleDefaultProps;
}

const DayScheduleHistory = (props: Props) => {
  const {scheduleHistoryPayload, schedule} = props;
  const {data: historyData, refetch: historyDataRefetch} =
    useGetScheduleHistory(scheduleHistoryPayload);
  const setGlobalModalState = useSetRecoilState(globalState.globalModalState);
  const [beaconState, setBeaconState] = useRecoilState(globalState.beaconState);
  const [wifiState, setWifiState] = useRecoilState(globalState.wifiState);
  const [intervalFormatted, setIntervalFormatted] = useState<
    Array<ScheduleTimeProps>
  >([]);
  const [isNow, setIsNow] = useState(false);
  const [isEnterAllow, setIsEnterAllow] = useState(false);
  const [isCompleteAllow, setIsCompleteAllow] = useState(false);
  const [isBefore, setIsBefore] = useState(false);
  const [isAfter, setIsAfter] = useState(false);
  const [isPermissions, setIsPermissions] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
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
      await requestStartBeaconScanning().then(result => {
        if (!result) {
          return;
        }
        requestAddBeaconListener(beacon => {});
        requestBeaconScanList().then(beacon => {
          beaconList = beacon ? validBeaconList(beacon) : [];
          setBeaconState(beaconList);
        });
      });
    }

    const beaconListData = beaconList.map(beaconItem => {
      return {
        uuid: beaconItem.uuid,
        major: beaconItem.major,
        minor: beaconItem.minor,
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

    // 출석 체크 payload
    return {
      attendeeId: scheduleHistoryPayload.attendeeId,
      scheduleId: schedule.scheduleId,
      latitude: locationData?.latitude ?? 0.1,
      longitude: locationData?.longitude ?? 0.1,
      altitude: locationData?.altitude ?? 0.1,
      wifis: wifiListData,
      bles: beaconListData,
    };
  };

  const openModal = (message: string) => {
    setGlobalModalState({
      isVisible: true,
      title: '안내',
      message: message,
    });
  };

  const onPressEnter = async () => {
    setButtonDisabled(true);

    const permissionsCheck = await permissionGranted();
    if (!permissionsCheck) return;
    const payload = await eventPayload();

    try {
      await postEventEnter(payload);
      await historyDataRefetch();
      openModal('입실 처리 되었습니다.');
    } catch (e: any) {
      const errorMessage = handleErrorResponse(e.code);
      openModal(errorMessage);
      await setAttToCrashlytics({...payload, permission: isPermissions});
      errorToCrashlytics(e, 'requestEventEnter');
    }

    setTimeout(() => {
      setButtonDisabled(false);
    }, 500);
  };

  const onPressComplete = () => {
    setGlobalModalState({
      isVisible: true,
      title: '안내',
      message: '퇴실하시겠습니까?',
      isConfirm: true,
      onPressConfirm: completeConfirm,
    });
  };

  const completeConfirm = async () => {
    setButtonDisabled(true);

    const permissionsCheck = await permissionGranted();
    if (!permissionsCheck) return;
    const payload = await eventPayload();
    // 퇴실
    try {
      await postEventComplete(payload);
      await historyDataRefetch();

      openModal('퇴실 처리 되었습니다.');
    } catch (e: any) {
      const errorMessage = handleErrorResponse(e.code);
      openModal(errorMessage);
      await setAttToCrashlytics({...payload, permission: isPermissions});
      errorToCrashlytics(e, 'requestEventComplete');
    }
    setTimeout(() => {
      setButtonDisabled(false);
    }, 500);
  };

  const onPressAttend = async () => {
    setButtonDisabled(true);

    const permissionsCheck = await permissionGranted();
    if (!permissionsCheck) return;
    const payload = await eventPayload();
    // 시간별 체크
    try {
      await postEventAttend(payload);
      await historyDataRefetch();

      openModal('확인 되었습니다.');
    } catch (e: any) {
      console.log(e);
      await setAttToCrashlytics({...payload, permission: isPermissions});
      errorToCrashlytics(e, 'requestEventAttend');
      if (e.code === '1004') {
        if (e.description.indexOf('입실') >= 0) {
          openModal('출석체크를 먼저 진행해주세요.');
          return;
        }
        if (e.description.indexOf('퇴실') >= 0) {
          openModal('이미 퇴실 처리 된 강의입니다.');
          return;
        }
        if (e.description.indexOf('외출') >= 0) {
          openModal('외출 종료 후 다시 시도해주세요.');
          return;
        }
        openModal('처리되지 않았습니다.');
        return;
      }

      const errorMessage = handleErrorResponse(e.code);
      openModal(errorMessage);
    }
    setTimeout(() => {
      setButtonDisabled(false);
    }, 500);
  };

  const onPressLeave = () => {
    setGlobalModalState({
      isVisible: true,
      title: '안내',
      message: '외출하시겠습니까?',
      isConfirm: true,
      onPressConfirm: leaveConfirm,
    });
  };

  const leaveConfirm = async () => {
    setButtonDisabled(true);

    const permissionsCheck = await permissionGranted();
    if (!permissionsCheck) return;
    const payload = await eventPayload();
    // 외출
    try {
      await postEventLeave(payload);
      await historyDataRefetch();

      openModal('외출이 시작되었습니다.');
    } catch (e: any) {
      const errorMessage = handleErrorResponse(e.code);
      openModal(errorMessage);
      await setAttToCrashlytics({...payload, permission: isPermissions});
      errorToCrashlytics(e, 'requestEventLeave');
    }
    setTimeout(() => {
      setButtonDisabled(false);
    }, 500);
  };

  const onPressComeback = () => {
    setGlobalModalState({
      isVisible: true,
      title: '안내',
      message: '외출 종료하시겠습니까?',
      isConfirm: true,
      onPressConfirm: comebackConfirm,
    });
  };

  const comebackConfirm = async () => {
    setButtonDisabled(true);

    const permissionsCheck = await permissionGranted();
    if (!permissionsCheck) return;
    const payload = await eventPayload();
    // 복귀
    try {
      await postEventComeback(payload);
      await historyDataRefetch();

      openModal('외출이 종료되었습니다.');
    } catch (e: any) {
      const errorMessage = handleErrorResponse(e.code);
      openModal(errorMessage);
      await setAttToCrashlytics({...payload, permission: isPermissions});
      errorToCrashlytics(e, 'requestEventComeback');
    }
    setTimeout(() => {
      setButtonDisabled(false);
    }, 500);
  };

  const timeSet = () => {
    const allowStartMinusTime = moment(schedule.scheduleStartTime).subtract(
      schedule.lecture.lectureAllowMinus,
      'minutes',
    );
    const allowEndPlusTime = moment(schedule.scheduleEndTime).add(
      schedule.lecture.lectureAllowEndPlus,
      'minutes',
    );
    setIsEnterAllow(
      isBetween(allowStartMinusTime, moment(schedule.scheduleEndTime)),
    );
    const isNowData = isBetween(allowStartMinusTime, allowEndPlusTime);
    setIsCompleteAllow(isBetween(allowStartMinusTime, allowEndPlusTime));
    setIsNow(isNowData); // 현재 강의
    setIsBefore(moment(allowEndPlusTime).isBefore(moment()) && !isNowData); // 지난 강의
    setIsAfter(moment(allowStartMinusTime).isAfter(moment()) && !isNowData); // 예정 강의
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      timeSet();
    }, 1500);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (historyData) {
      const formattedData = attendList(historyData);
      setIntervalFormatted(formattedData);
      timeSet();
    }
  }, [historyData]);

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <SvgIcon name="MapPoint" size={15} />
          <CText text={schedule.lecture.lecturePlaceName} />
        </View>
        {isBefore &&
          (historyData?.completeEvent?.eventType === 'COMPLETE' ? (
            <LightButton color="blue" text="출석완료" />
          ) : (
            <LightButton color="red" text="강의종료" />
          ))}
        {isAfter && <LightButton color="gray" text="출석전" />}
      </View>
      {isEnterAllow && !historyData?.enterEvent && (
        <CButton
          text="출석체크"
          onPress={onPressEnter}
          buttonStyle={{height: 28, marginBottom: 10}}
          fontSize={11}
          noMargin
        />
      )}
      {isCompleteAllow && historyData?.enterEvent && (
        <CButton
          text={
            historyData.completeEvent?.eventType === 'COMPLETE'
              ? '퇴실 완료'
              : '퇴실'
          }
          onPress={onPressComplete}
          buttonStyle={{height: 28, marginBottom: 10}}
          fontSize={11}
          disabled={
            buttonDisabled ||
            historyData.completeEvent?.eventType === 'COMPLETE'
          }
          noMargin
        />
      )}
      {isNow && historyData?.enterEvent && !historyData.completeEvent && (
        <View style={styles.leaveButtons}>
          <CButton
            text="외출시작"
            onPress={onPressLeave}
            buttonStyle={{height: 28, flex: 0.49}}
            fontSize={12}
            noMargin
            disabled={buttonDisabled || historyData.isLeaved}
          />
          <CButton
            text="외출종료"
            onPress={onPressComeback}
            buttonStyle={{height: 28, flex: 0.49}}
            fontSize={12}
            noMargin
            disabled={buttonDisabled || !historyData.isLeaved}
          />
        </View>
      )}
      {schedule.scheduleTimeList &&
        intervalFormatted.map((val, index) => {
          const startTime = moment(val.timeStart).subtract(
            schedule.lecture.lectureAllowMinus,
            'minutes',
          );
          const endTime = moment(val.timeEnd).add(
            schedule.lecture.lectureAllowEndPlus,
            'minutes',
          );
          const intervalIsBetween = isBetween(startTime, endTime); // 시간별 출석

          return (
            <View
              key={index}
              style={{flexDirection: 'row', flex: 1, marginBottom: 8}}>
              <View style={styles.attendInfo}>
                <CText
                  text={index + 1 + '교시'}
                  color={COLORS.primary}
                  fontWeight="600"
                />
                <CText
                  text={`${moment(val.timeStart).format('HH:mm')} ~ ${moment(
                    val.timeEnd,
                  ).format('HH:mm')}`}
                  fontSize={12}
                />
              </View>
              {val.check ? ( // 시간별 체크 = true
                // 시간별 체크 출석 값이 있을 때
                val.eventType ? (
                  <Pressable
                    style={[styles.attendButton, styles.attendButtonEntered]}
                    disabled>
                    <CText
                      text="출석완료"
                      fontSize={11}
                      color={COLORS.primary}
                    />
                  </Pressable>
                ) : (
                  // 시간별 체크 출석 값이 없을 때
                  <Pressable
                    style={[
                      styles.attendButton,
                      !intervalIsBetween && styles.attendButtonDisabled,
                    ]}
                    onPress={onPressAttend}
                    disabled={
                      buttonDisabled ||
                      historyData?.completeEvent?.eventType === 'COMPLETE' || // 퇴실 처리 했을 경우
                      !intervalIsBetween
                    }>
                    <CText
                      text={intervalIsBetween ? '출석하기' : '미출석'}
                      fontSize={11}
                      color={intervalIsBetween ? COLORS.dark.red : 'black'}
                    />
                  </Pressable>
                )
              ) : (
                // 시간은 나누어져 있지만 시간별 출석을 하지 않는 경우
                <Pressable
                  style={[styles.attendButton, styles.attendButtonDisabled]}
                  disabled>
                  <CText text="PASS" fontSize={11} />
                </Pressable>
              )}
            </View>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  attendButton: {
    width: 53,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light.red,
    borderWidth: 1,
    borderColor: COLORS.dark.red,
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    height: 40,
  },
  leaveButtons: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  attendInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: COLORS.layout,
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
    height: 40,
  },
  attendButtonEntered: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.light.blue,
  },
  attendButtonDisabled: {
    borderColor: COLORS.dark.gray,
    backgroundColor: COLORS.light.gray,
  },
});

export default DayScheduleHistory;
