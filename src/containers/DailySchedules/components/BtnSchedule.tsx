import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {UseMutateAsyncFunction} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import CButton from '#components/common/CommonButton/CButton.tsx';
import {IS_ANDROID} from '#constants/common.ts';
import BtnScheduleAttendInfo from '#containers/DailySchedules/components/BtnScheduleAttendInfo.tsx';
import {
  useGetScheduleHistory,
  useReqAttend,
  useReqComeback,
  useReqComplete,
  useReqEnter,
  useReqLeave,
} from '#containers/DailySchedules/hooks/useApi.ts';
import {
  useEventPayload,
  useGetAttendeeId,
} from '#containers/DailySchedules/hooks/useSchedules.ts';
import {allowScheduleTime} from '#containers/DailySchedules/utils/dateHelper.ts';
import {useGlobalInterval} from '#hooks/useGlobal.ts';
import GlobalState from '#recoil/Global';
import {errorToCrashlytics, setAttToCrashlytics} from '#services/firebase.ts';
import {CommonResponseProps} from '#types/common.ts';
import {
  EventType,
  PostEventProps,
  ScheduleDefaultProps,
  ScheduleHistoryDataProps,
} from '#types/schedule.ts';
import {
  handleOpenSettings,
  requestLocationPermissions,
} from '#utils/permissionsHelper.ts';

type StatusIconType = 'IntervalComplete' | 'IntervalMiss' | 'IntervalEmpty';
export interface TimeStatusProps {
  isCheck: boolean;
  isBetween: boolean;
  isAttendEnter: boolean;
  eventType: string;
  status: StatusIconType;
}

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

  const [isAttendTime, setIsAttendTime] = useState(false);
  const [timeStatusList, setTimeStatusList] = useState<TimeStatusProps[]>([]);

  const fetchEventPayload = useEventPayload();
  const {mutateAsync: reqEnterEvent} = useReqEnter();
  const {mutateAsync: reqCompleteEvent} = useReqComplete();
  const {mutateAsync: reqLeaveEvent} = useReqLeave();
  const {mutateAsync: reqComebackEvent} = useReqComeback();
  const {mutateAsync: reqAttendEvent} = useReqAttend();

  const attendeeId = useGetAttendeeId();
  const {historyData, refetchHistoryData} = useGetScheduleHistory({
    scheduleId: scheduleData?.scheduleId ?? '',
  });

  // 권한 확인
  const permissionGranted = async () => {
    const grantedResult = await requestLocationPermissions();
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
    }
    return grantedResult;
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
    const payload = await fetchEventPayload(
      attendeeId,
      scheduleData?.scheduleId ?? 'scheduleId',
    );
    payload.locationPermit = permissionsCheck;
    console.log('EVENT PAYLOAD:', payload);
    try {
      await requestEvent(payload);
      await refetchHistoryData();
    } catch (e: any) {
      console.log('req enter error', e);
      await setAttToCrashlytics({...payload, permission: permissionsCheck});
      errorToCrashlytics(e, eventName);
    } finally {
      setIsLoading(false);
    }
  };

  // 입실 / 재실 버튼 클릭
  const onPressEnter = async () => {
    const isEntered = !!historyData?.enterEvent;
    if (isEntered && isAttendTime) {
      await handleEvent(reqAttendEvent, 'requestEventAttend'); // 재실
      return;
    }
    await handleEvent(reqEnterEvent, 'requestEventEnter'); // 입실
  };

  // 퇴실 / 외출 / 외출 종료 버튼 클릭
  const onPressAction = (eventType: EventType) => {
    const eventInfo = {
      COMPLETE: {
        message: '퇴실하시겠습니까?',
        eventFn: () => handleEvent(reqCompleteEvent, 'requestEventComplete'),
      },
      LEAVE: {
        message: '외출하시겠습니까?',
        eventFn: () => handleEvent(reqLeaveEvent, 'requestEventLeave'),
      },
      COMEBACK: {
        message: '외출 종료하시겠습니까?',
        eventFn: () => handleEvent(reqComebackEvent, 'requestEventComeback'),
      },
      ATTEND: {message: '', eventFn: () => {}},
      ENTER: {message: '', eventFn: () => {}},
    };

    setGlobalModalState({
      isVisible: true,
      title: '안내',
      message: eventInfo[eventType].message,
      isConfirm: true,
      onPressConfirm: eventInfo[eventType].eventFn,
    });
  };

  // 현재 시간별 출결의 활성화 여부
  const updateTimeStatus = useCallback(() => {
    const newStatusList =
      scheduleData?.scheduleTimeList.map(data => {
        const {isAttendBetween, isAttendAfter, isAttendEnter} =
          allowScheduleTime({
            scheduleData,
            startTime: data.timeStart,
            endTime: data.timeEnd,
          });
        // 시간별 출결의 출석 상태 아이콘
        const isEntered = historyData?.intervalEventList?.some(
          item => item?.baseTime === data.timeStart,
        );
        const status: StatusIconType = isEntered
          ? 'IntervalComplete'
          : isAttendAfter
            ? 'IntervalMiss'
            : 'IntervalEmpty';

        return {
          isBetween: isAttendBetween,
          isAttendEnter,
          eventType: isEntered ? 'ATTEND' : '',
          status,
          isCheck: data.check,
        };
      }) ?? [];

    setTimeStatusList(prevList => {
      const hasChanged = newStatusList.some((newStatus, i) => {
        if (newStatusList) {
          const current = prevList[i];
          return (
            current?.isBetween !== newStatus?.isBetween ||
            current?.isAttendEnter !== newStatus?.isAttendEnter ||
            current?.eventType !== newStatus?.eventType ||
            current?.status !== newStatus?.status ||
            current?.isCheck !== newStatus?.isCheck
          );
        }
      });
      // 상태가 변경된 경우에만 업데이트
      if (hasChanged) {
        // 시간별 출결의 출석 유효 시간 + 미출석 + 시간별 체크 활성화 일 경우 [출석] 버튼 활성화 되도록 전달
        const isEnter = newStatusList.some(
          ({isAttendEnter, status, isCheck}) =>
            isAttendEnter && status === 'IntervalEmpty' && isCheck,
        );
        setIsAttendTime(isEnter);
        return newStatusList;
      }
      return prevList;
    });
  }, [scheduleData, historyData]);
  useGlobalInterval(updateTimeStatus, 3000);

  return (
    <>
      {isBtnAvailable &&
        !historyData?.completeEvent &&
        (!isAllowedAfterEnd || !!historyData?.enterEvent) && (
          <>
            <View style={styles.checkButtons}>
              <CButton
                text={historyData?.enterEvent ? '출석' : '입실'}
                onPress={onPressEnter}
                buttonStyle={[styles.checkButton, styles.buttonCommon]}
                disabled={
                  isAllowedAfterEnd || // 퇴실 이후이면
                  !!historyData?.completeEvent || // 퇴실 있으면
                  !!historyData?.enterEvent
                    ? !isAttendTime // 입실 했으면 조건에 따라
                    : false // 입실 안했으면
                }
                fontSize={12}
                noMargin
              />
              <CButton
                text="퇴실"
                onPress={() => {
                  onPressAction('COMPLETE');
                }}
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
                onPress={() =>
                  historyData?.isLeaved
                    ? onPressAction('COMEBACK')
                    : onPressAction('LEAVE')
                }
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
          timeStatusList={timeStatusList}
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
