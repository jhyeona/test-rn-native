import React, {useEffect, useState} from 'react';
import {
  GetScheduleHistoryProps,
  PostEventProps,
  ScheduleDefaultProps,
  ScheduleTimeProps,
} from '../../types/schedule.ts';
import {Pressable, StyleSheet, View} from 'react-native';
import {COLORS} from '../../constants/colors.ts';
import SvgIcon from '../common/Icon/Icon.tsx';
import CButton from '../common/CommonButton/CButton.tsx';
import CText from '../common/CustomText/CText.tsx';
import moment from 'moment';
import {
  postEventAttend,
  postEventComeback,
  postEventComplete,
  postEventEnter,
  postEventLeave,
  useGetScheduleHistory,
} from '../../hooks/useSchedule.ts';
import {useRecoilState, useSetRecoilState} from 'recoil';
import globalState from '../../recoil/Global';
import {
  handleOpenSettings,
  requestLocationPermissions,
} from '../../utils/permissionsHelper.ts';
import {IS_ANDROID} from '../../constants/common.ts';
import {validBeaconList, validWifiList} from '../../utils/locationHelper.ts';
import {
  requestAddBeaconListener,
  requestBeaconScanList,
  requestStartBeaconScanning,
} from '../../services/beaconScanner.ts';
import {
  requestGetLocationInfo,
  requestWifiList,
} from '../../services/locationScanner.ts';

interface Props {
  scheduleHistoryPayload: GetScheduleHistoryProps;
  schedule: ScheduleDefaultProps;
}

const lightButton = (color: string, text: string) => {
  let textColor = 'black';
  let borderColor = 'black';
  let backgroundColor = COLORS.lightGray;

  switch (color) {
    case 'blue':
      textColor = COLORS.primary;
      borderColor = COLORS.primary;
      backgroundColor = COLORS.primaryLight;
      break;
    case 'red':
      textColor = COLORS.dark.red;
      borderColor = COLORS.dark.red;
      backgroundColor = COLORS.light.red;
      break;
    default:
      break;
  }

  return (
    <Pressable
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: 58,
        height: 24,
        backgroundColor: backgroundColor,
        borderWidth: 1,
        borderColor: borderColor,
        borderRadius: 7,
      }}>
      <CText text={text} fontSize={11} color={textColor} />
    </Pressable>
  );
};

const DayScheduleHistory = (props: Props) => {
  const {scheduleHistoryPayload, schedule} = props;
  const historyData = useGetScheduleHistory(scheduleHistoryPayload);
  const setGlobalModalState = useSetRecoilState(globalState.globalModalState);
  const [beaconState, setBeaconState] = useRecoilState(globalState.beaconState);
  const [wifiState, setWifiState] = useRecoilState(globalState.wifiState);
  const [intervalFormatted, setIntervalFormatted] = useState<
    Array<ScheduleTimeProps>
  >([]);
  const [isNow, setIsNow] = useState(false);
  const [isBefore, setIsBefore] = useState(false);
  const [isAfter, setIsAfter] = useState(false);

  const permissionGranted = async () => {
    const grantedResult = await requestLocationPermissions();
    console.log(grantedResult);
    if (!grantedResult) {
      setGlobalModalState({
        isVisible: true,
        title: '권한 설정 안내',
        message: `출결을 위해 ${
          IS_ANDROID ? '위치와 근처기기' : '위치'
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
        console.log('result', result);
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

  const onPressEnter = async () => {
    const permissionsCheck = await permissionGranted();
    if (!permissionsCheck) return;
    const payload = await eventPayload();

    try {
      const response = await postEventEnter(payload);
      console.log('RESPONSE:', response);

      setGlobalModalState({
        isVisible: true,
        title: '안내',
        message: '입실 처리 되었습니다.',
      });
    } catch (e: any) {
      console.log(e);
      // TODO: e: any 의 에러처리
      if (e.code === '1004') {
        setGlobalModalState({
          isVisible: true,
          title: '안내',
          message: '이미 입실 처리 되었습니다.',
        });
        return;
      }
      if (e.code === '1005') {
        setGlobalModalState({
          isVisible: true,
          title: '안내',
          message: '현재 진행중인 강의가 아닙니다.',
        });
        return;
      }
      if (e.code === '4061') {
        setGlobalModalState({
          isVisible: true,
          title: '안내',
          message: '강의에 입력된 위치 인증 장치 정보에 부합하지 않습니다.',
        });
        return;
      }
      console.log(e);
    }
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
    // if (!permissionGranted) return;
    const payload = await eventPayload();

    // 퇴실
    try {
      const response = await postEventComplete(payload);
      setGlobalModalState({
        isVisible: true,
        title: '안내',
        message: '퇴실 처리 되었습니다.',
      });
    } catch (e: any) {
      if (e.code === '1004') {
        setGlobalModalState({
          isVisible: true,
          title: '안내',
          message: '이미 퇴실 처리 되었습니다.',
        });
        return;
      }
      if (e.code === '4061') {
        setGlobalModalState({
          isVisible: true,
          title: '안내',
          message: '강의에 입력된 위치 인증 장치 정보에 부합하지 않습니다.',
        });
        return;
      }
      console.log(e);
    }
  };

  const onPressAttend = async () => {
    if (!permissionGranted) return;
    const payload = await eventPayload();
    // 시간별 체크
    try {
      const response = await postEventAttend(payload);
      console.log('시간별체크:', response);
      setGlobalModalState({
        isVisible: true,
        title: '안내',
        message: '확인 되었습니다.',
      });
    } catch (e: any) {
      if (e.code === '1004') {
        const enter = e.description.indexOf('입실');
        const complete = e.description.indexOf('퇴실');

        if (enter >= 0) {
          setGlobalModalState({
            isVisible: true,
            title: '안내',
            message: '출석체크를 먼저 진행해주세요.',
          });
          return;
        }
        if (complete >= 0) {
          setGlobalModalState({
            isVisible: true,
            title: '안내',
            message: '이미 퇴실 처리 된 강의입니다.',
          });
          return;
        }
      }
      if (e.code === '1005') {
        setGlobalModalState({
          isVisible: true,
          title: '안내',
          message: '출석 인정 시간이 아닙니다.',
        });
        return;
      }
      if (e.code === '1006') {
        setGlobalModalState({
          isVisible: true,
          title: '안내',
          message: '해당 강의는 주기적으로 확인하는 강의가 아닙니다.',
        });
        return;
      }
      if (e.code === '4061') {
        setGlobalModalState({
          isVisible: true,
          title: '안내',
          message: '위치 정보가 올바르지 않습니다.',
        });
        return;
      }
    }
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
    if (!permissionGranted) return;
    const payload = await eventPayload();
    // 외출
    try {
      const response = await postEventLeave(payload);
      console.log('외출:', response);
      setGlobalModalState({
        isVisible: true,
        title: '안내',
        message: '외출이 시작되었습니다.',
      });
    } catch (e: any) {
      console.log(e);
      if (e.code === '1004') {
        setGlobalModalState({
          isVisible: true,
          title: '안내',
          message: '이미 외출중입니다.',
        });
        return;
      }
      if (e.code === '1005') {
        setGlobalModalState({
          isVisible: true,
          title: '안내',
          message: '현재 진행중인 강의가 아닙니다.',
        });
        return;
      }
    }
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
    if (!permissionGranted) return;
    const payload = await eventPayload();
    // 복귀
    try {
      const response = await postEventComeback(payload);
      console.log('컴백:', response);
      setGlobalModalState({
        isVisible: true,
        title: '안내',
        message: '외출이 종료되었습니다.',
      });
    } catch (e: any) {
      console.log(e);
      if (e.code === '1004') {
        setGlobalModalState({
          isVisible: true,
          title: '안내',
          message: '외출중이 아닙니다.',
        });
        return;
      }
      if (e.code === '1005') {
        setGlobalModalState({
          isVisible: true,
          title: '안내',
          message: '현재 진행중인 강의가 아닙니다.',
        });
        return;
      }
    }
  };

  const isBetween = (startTime: string, endTime: string) => {
    return moment().isBetween(startTime, endTime, undefined, '[]');
  };

  const timeSet = () => {
    const allowStartTime = moment(schedule.scheduleStartTime)
      .subtract(schedule.lecture.lectureAllowMinus, 'minutes')
      .format('YYYY-MM-DD HH:mm');
    const allowEndTime = moment(schedule.scheduleEndTime)
      .add(schedule.lecture.lectureAllowEndPlus, 'minutes')
      .format('YYYY-MM-DD HH:mm');
    setIsNow(isBetween(allowStartTime, allowEndTime)); // 현재 강의
    setIsBefore(moment(allowEndTime).isBefore(moment()) && !isNow); // 지난 강의
    setIsAfter(moment(allowStartTime).isAfter(moment()) && !isNow); // 예정 강의
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      timeSet();
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (historyData) {
      timeSet();
      const timeList = historyData.scheduleTimeList;
      const attendTrueList = historyData.scheduleTimeList
        .filter(val => {
          return val.check;
        })
        .map(item => ({...item}));

      const intervalEventList = historyData.intervalEventList?.map(item => ({
        ...item,
      })); // map 을 사용하여 깊은 복사

      const result = timeList.map(item => {
        if (item.check) {
          const matchedTime = attendTrueList.shift(); // 시간별 체크 리스트
          const matchedEvent = intervalEventList?.shift(); // 시간별 체크의 이벤트 리스트
          return {
            ...item,
            ...(matchedTime && {check: matchedTime.check}),
            ...(matchedEvent?.eventType && {eventType: matchedEvent.eventType}),
          };
        } else {
          return item;
        }
      });
      setIntervalFormatted(result);
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
        <View style={{flexDirection: 'row'}}>
          <SvgIcon name="MapPoint" size={15} />
          <CText text={schedule.lecture.lecturePlaceName} />
        </View>
        {isBefore &&
          (historyData?.completeEvent?.eventType === 'COMPLETE'
            ? lightButton('blue', '출석완료')
            : lightButton('red', '강의종료'))}
        {isAfter && lightButton('GRAY', '출석 전')}
      </View>
      {isNow && !historyData?.enterEvent && (
        <CButton
          text="출석체크"
          onPress={onPressEnter}
          buttonStyle={{height: 28, marginBottom: 10}}
          fontSize={11}
          noMargin
        />
      )}
      {historyData?.enterEvent && historyData?.isAllowedComplete && (
        <CButton
          text={
            historyData.completeEvent?.eventType === 'COMPLETE'
              ? '퇴실 완료'
              : '퇴실'
          }
          onPress={onPressComplete}
          buttonStyle={{height: 28, marginBottom: 10}}
          fontSize={11}
          disabled={historyData.completeEvent?.eventType === 'COMPLETE'}
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
            disabled={historyData.isLeaved}
          />
          <CButton
            text="외출종료"
            onPress={onPressComeback}
            buttonStyle={{height: 28, flex: 0.49}}
            fontSize={12}
            noMargin
            disabled={!historyData.isLeaved}
          />
        </View>
      )}
      {schedule.scheduleTimeList &&
        intervalFormatted.map((val, index) => {
          const startTime = moment(val.timeStart)
            .subtract(schedule.lecture.lectureAllowMinus, 'minutes')
            .format('YYYY-MM-DD HH:mm');
          const endTime = moment(val.timeEnd)
            .add(schedule.lecture.lectureAllowEndPlus, 'minutes')
            .format('YYYY-MM-DD HH:mm');
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
                val.eventType ? ( // 시간별 체크에 출석 값이 있을 때
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
                  <Pressable
                    style={[styles.attendButton]}
                    onPress={onPressAttend}
                    disabled={
                      historyData?.completeEvent?.eventType === 'COMPLETE' || // 퇴실 처리 했을 경우
                      !isNow
                    }>
                    <CText
                      text={
                        isNow
                          ? intervalIsBetween
                            ? '출석하기'
                            : '미출석'
                          : isBefore
                            ? '출석종료'
                            : '출석예정'
                      }
                      fontSize={11}
                      color={COLORS.dark.red}
                    />
                  </Pressable>
                )
              ) : (
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
