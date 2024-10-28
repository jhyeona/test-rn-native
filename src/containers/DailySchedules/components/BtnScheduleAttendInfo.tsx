import {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {COLORS} from '#constants/colors.ts';
import {TimeStatusProps} from '#containers/DailySchedules/components/BtnSchedule.tsx';
import {formattedDate} from '#containers/DailySchedules/components/DaySchedulesTime.tsx';
import {ScheduleDefaultProps} from '#types/schedule.ts';

const BtnScheduleAttendInfo = ({
  scheduleData,
  timeStatusList,
}: {
  scheduleData?: ScheduleDefaultProps;
  timeStatusList: TimeStatusProps[];
}) => {
  return (
    <View style={styles.container}>
      {timeStatusList.length === scheduleData?.scheduleTimeList.length &&
        scheduleData?.scheduleTimeList.map((data, i) => {
          const {isBetween, status} = timeStatusList[i];
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
