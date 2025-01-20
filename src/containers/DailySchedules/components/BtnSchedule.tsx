import {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {RESULTS} from 'react-native-permissions';

import {UseMutateAsyncFunction} from '@tanstack/react-query';
import moment from 'moment/moment';
import {useSetRecoilState} from 'recoil';

import CButton from '#components/common/CommonButton/CButton.tsx';
import {IS_ANDROID, IS_IOS} from '#constants/common.ts';
import {eventErrorMessage} from '#constants/responseMessage.ts';
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
  useGetAttendeeInfo,
} from '#containers/DailySchedules/hooks/useSchedules.ts';
import {allowScheduleTime} from '#containers/DailySchedules/utils/dateHelper.ts';
import {permissions} from '#containers/DailySchedules/utils/permissionsHelper.ts';
import {useGlobalInterval} from '#hooks/useGlobal.ts';
import {PERMISSIONS_MODAL} from '#permissions/constants';
import {requestNotificationsPermission} from '#permissions/index.ts';
import {handleOpenSettings} from '#permissions/utils/permissionsHepler.ts';
import {checkPermissionWithModal} from '#permissions/utils/withModalHelper.ts';
import GlobalState from '#recoil/Global';
import {sentryCaptureException} from '#services/sentry.ts';
import {CommonResponseProps} from '#types/common.ts';
import {
  EventType,
  PostEventProps,
  ScheduleDefaultProps,
  ScheduleHistoryDataProps,
} from '#types/schedule.ts';
import {
  destroyScanner,
  initScanner,
  isInitScanner,
  startEscapeCheck,
} from '#utils/stickySdkHelper.ts';

type StatusIconType = 'IntervalComplete' | 'IntervalMiss' | 'IntervalEmpty';
export interface TimeStatusProps {
  isCheck: boolean;
  isBetween: boolean;
  isAttendEnter: boolean;
  eventType: string;
  status: StatusIconType;
}

const BUTTON_HEIGHT = 28;
// TODO: 언젠가 코드 정리..🫠
const BtnSchedule = ({
  scheduleData,
  isBtnAvailable,
  isAllowedAfterEnd,
}: {
  scheduleData: ScheduleDefaultProps;
  isBtnAvailable: boolean;
  isAllowedAfterEnd: boolean;
}) => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setGlobalModalState = useSetRecoilState(GlobalState.globalModalState);

  const {selectedAcademyUseEscapeCheck} = useGetAttendeeInfo();
  const fetchEventPayload = useEventPayload({scheduleData, selectedAcademyUseEscapeCheck});

  const [attendIndex, setAttendIndex] = useState(-1);
  const [isAttendTime, setIsAttendTime] = useState(false);
  const [useEscapeLecture] = useState(
    scheduleData.lecture.lectureUseEscapeCheck && selectedAcademyUseEscapeCheck,
  );
  const [timeStatusList, setTimeStatusList] = useState<TimeStatusProps[]>([]);

  const {mutateAsync: reqEnterEvent} = useReqEnter();
  const {mutateAsync: reqCompleteEvent} = useReqComplete();
  const {mutateAsync: reqLeaveEvent} = useReqLeave();
  const {mutateAsync: reqComebackEvent} = useReqComeback();
  const {mutateAsync: reqAttendEvent} = useReqAttend();

  const {historyData, refetchHistoryData} = useGetScheduleHistory({
    scheduleId: scheduleData.scheduleId,
  });

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

    const scheduleId = scheduleData.scheduleId;
    const endTime = moment(scheduleData.scheduleEndTime).unix();

    const payload = await fetchEventPayload(scheduleId);
    const useEscapeCheck = eventName === 'requestEventEnter' && useEscapeLecture;

    try {
      if (!isInitScanner()) {
        initScanner({isCellEnable: useEscapeLecture});
      }

      // 자동이탈체크 사용 시 phone 권한 확인
      if (useEscapeCheck) {
        const phonePermissionsCheck = await checkPermissionWithModal({
          requestType: 'phone',
          setGlobalModalState,
        });
        if (!phonePermissionsCheck) return;
      }

      // 출석 이벤트
      await requestEvent(payload);
      await refetchHistoryData();

      // SDK - 입실
      if (useEscapeCheck) {
        await startEscapeCheck({scheduleId, endTime});
      }

      // SDK - 퇴실
      if (eventName === 'requestEventComplete' && isInitScanner()) {
        destroyScanner();
      }
    } catch (error: any) {
      if (error?.code in eventErrorMessage) {
        sentryCaptureException({error, payload, eventName});
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 입실 / 재실 버튼 클릭
  const onPressEnter = async () => {
    const {isLocation, isBluetooth} = await permissions({setGlobalModalState}, useEscapeLecture);
    if (!isLocation || !isBluetooth) return;

    // 재실
    const isEntered = !!historyData?.enterEvent;
    if (isEntered && isAttendTime) {
      await handleEvent(reqAttendEvent, 'requestEventAttend');
      return;
    }

    // 입실
    if (useEscapeLecture) {
      if (IS_ANDROID) {
        // [Android] 자동이탈체크 + 안드로이드인 경우 백그라운드 사용을 위한 안내
        const message = PERMISSIONS_MODAL.backgroundLecture.message;
        setGlobalModalState({
          isVisible: true,
          isConfirm: true,
          title: '출석 안내',
          message: message,
          onPressConfirm: async () => {
            await handleEvent(reqEnterEvent, 'requestEventEnter');
          },
        });
        return;
      }
      // [iOS] 푸시로 백그라운드 알림을 띄우기 위한 알림 권한 요청
      const notification = await requestNotificationsPermission();
      if (notification !== RESULTS.GRANTED) {
        setGlobalModalState({
          isVisible: true,
          isConfirm: true,
          title: '권한 안내',
          message: '해당 강의는 알림 권한이 필요합니다. 확인을 누르시면 설정으로 이동합니다.',
          onPressConfirm: () => handleOpenSettings(),
        });
        return;
      }
    }
    await handleEvent(reqEnterEvent, 'requestEventEnter');
  };

  // 퇴실 / 외출 / 외출 종료 버튼 클릭
  const onPressAction = async (eventType: EventType) => {
    const {isLocation, isBluetooth} = await permissions({setGlobalModalState}, useEscapeLecture);
    if (!isLocation || !isBluetooth) return;

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
      scheduleData.scheduleTimeList.map(data => {
        const {isAttendBetween, isAttendAfter, isAttendEnter} = allowScheduleTime({
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
          status,
          isAttendEnter,
          isBetween: isAttendBetween,
          eventType: isEntered ? 'ATTEND' : '',
          isCheck: data.check,
        };
      }) ?? [];

    // 출석버튼에 [x 교시 출석] 으로 표현하기 위한 값
    const index = newStatusList.findIndex((item, i) => {
      const nextItem = newStatusList[i + 1];
      return item.isBetween && !nextItem?.isBetween;
    });
    if (index + 1 !== attendIndex) setAttendIndex(index + 1);

    // 상태가 변경된 경우에만 업데이트
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
      if (hasChanged) {
        // (1)시간별 출결의 출석 시간인 경우 + (2)미출석인 경우 + (3)시간별 체크 활성화 일 경우 [출석] 버튼 활성화
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
        (historyData?.completeEvent ? (
          <CButton
            text="퇴실 완료"
            onPress={() => {}}
            buttonStyle={styles.buttonCommon}
            disabled
            fontSize={12}
            noMargin
          />
        ) : (
          (!isAllowedAfterEnd || !!historyData?.enterEvent) && (
            <>
              <View style={styles.checkButtons}>
                <CButton
                  text={`${scheduleData.scheduleTimeList.length > 1 && attendIndex > 0 ? attendIndex + '교시 ' : ''}출석`} // [참고] historyData.enterEvent 있을 경우 재실 확인, 없으면 입실 확인
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
                  onPress={() => onPressAction('COMPLETE')}
                  buttonStyle={[styles.checkButton, styles.buttonCommon]}
                  disabled={!historyData?.enterEvent || !!historyData?.completeEvent}
                  fontSize={12}
                  noMargin
                />
              </View>
              {!historyData?.completeEvent && (
                <CButton
                  text={historyData?.isLeaved ? '외출 종료' : '외출 시작'}
                  onPress={() => onPressAction(historyData?.isLeaved ? 'COMEBACK' : 'LEAVE')}
                  buttonStyle={styles.buttonCommon}
                  whiteButton={historyData?.isLeaved}
                  disabled={!historyData?.enterEvent || isAllowedAfterEnd}
                  fontSize={12}
                  noMargin
                />
              )}
            </>
          )
        ))}
      {/* 시간별 출결일 경우 */}
      {scheduleData.scheduleTimeList.length && (
        <BtnScheduleAttendInfo scheduleData={scheduleData} timeStatusList={timeStatusList} />
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
