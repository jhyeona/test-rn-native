import {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {SetterOrUpdater} from 'recoil';

import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {COLORS} from '#constants/colors.ts';
import {formattedDate} from '#containers/DailySchedules/components/DaySchedulesTime.tsx';
import {useGetScheduleHistory} from '#containers/DailySchedules/hooks/useApi.ts';
import {useGetAttendeeId} from '#containers/DailySchedules/hooks/useSchedules.ts';
import {allowScheduleTime} from '#containers/DailySchedules/utils/dateHelper.ts';
import {useGlobalInterval} from '#hooks/useGlobal.ts';
import {ScheduleDefaultProps} from '#types/schedule.ts';

type StatusIconType = 'IntervalComplete' | 'IntervalMiss' | 'IntervalEmpty';

const BtnScheduleAttendInfo = ({
  scheduleData,
  setIsEnter,
}: {
  scheduleData?: ScheduleDefaultProps;
  setIsEnter?: SetterOrUpdater<boolean>;
}) => {
  const [timeStatusList, setTimeStatusList] = useState<
    {
      isBetween: boolean;
      isAttendEnter: boolean;
      eventType: string;
      status: StatusIconType;
    }[]
  >([]);

  const attendeeId = useGetAttendeeId();
  const {historyData} = useGetScheduleHistory({
    attendeeId: attendeeId,
    scheduleId: scheduleData?.scheduleId,
  });

  // 현재 시간별 출결의 활성화 여부
  const updateTimeStatus = useCallback(() => {
    const newStatusList =
      scheduleData?.scheduleTimeList.map((data, i) => {
        const {isAttendBetween, isAttendAfter, isAttendEnter} =
          allowScheduleTime({
            scheduleData,
            startTime: data.timeStart,
            endTime: data.timeEnd,
          });
        // 시간별 출결의 출석 상태 아이콘
        const isEntered = !!historyData?.intervalEventList?.[i];
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
            current?.status !== newStatus?.status
          );
        }
      });
      // 상태가 변경된 경우에만 업데이트
      if (hasChanged) {
        if (setIsEnter) {
          // 시간별 출결의 출석 유효 시간 + 미출석일 경우 [출석] 버튼 활성화 되도록 전달
          const isEnter = newStatusList.some(
            ({isAttendEnter, status}) =>
              isAttendEnter && status === 'IntervalEmpty',
          );
          setIsEnter(isEnter);
        }
        return newStatusList;
      }
      return prevList;
    });
  }, [scheduleData]);

  useGlobalInterval(updateTimeStatus, 3000);

  return (
    <View style={styles.container}>
      {scheduleData?.scheduleTimeList.map((data, i) => {
        const {isBetween, status} = timeStatusList[i] || {};
        return (
          <View
            key={`schedule-interval-info-${i}`}
            style={styles.scheduleContainer}>
            <View
              style={[
                styles.scheduleInfo,
                {borderColor: isBetween ? COLORS.primary : COLORS.light.gray},
              ]}>
              <View style={styles.scheduleTime}>
                <CText
                  text={`${i + 1}교시`}
                  fontSize={16}
                  fontWeight="700"
                  color={COLORS.primary}
                />
                <CText
                  text={`${formattedDate(data.timeStart)} ~ ${formattedDate(
                    data.timeEnd,
                  )}`}
                />
              </View>
              <View style={styles.buttonWrap}>
                {data.check ? (
                  status && <SvgIcon name={status} width={23} height={23} />
                ) : (
                  <View style={styles.statusPass} />
                )}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 10,
  },
  scheduleContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  scheduleInfo: {
    gap: 6,
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 7,
  },
  scheduleTime: {
    gap: 8,
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 23,
    height: 23,
  },
  statusPass: {
    width: 20,
    borderBottomWidth: 3,
    borderColor: COLORS.disabled,
  },
});

export default BtnScheduleAttendInfo;
