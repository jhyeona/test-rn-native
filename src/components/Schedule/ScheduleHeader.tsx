import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';

import {useRecoilValue} from 'recoil';

import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import BtnToday from '#components/Schedule/BtnToday.tsx';
import {COLORS} from '#constants/colors.ts';
import scheduleState from '#recoil/Schedule';
import {weekOfMonth} from '#utils/scheduleHelper.ts';

const ScheduleHeader = () => {
  const {isWeekly, date} = useRecoilValue(scheduleState.selectedCalendarDate);
  const onPressRefreshCalendar = () => {
    console.log('onPressRefreshCalendar');
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <View style={styles.title}>
          <CText
            text={isWeekly ? '주간 일정' : '일간 일정'}
            fontWeight="700"
            fontSize={22}
          />
          <SvgIcon name="Calendar" size={24} />
          <CText
            text={
              isWeekly ? weekOfMonth(date) : date.format('YYYY.MM.DD') // 선택된 날짜를 기준으로 표시할 때
              // isWeekend ? weekOfMonth(moment()) : moment().format('YYYY.MM.DD') // 오늘을 기준으로 표시할 때
            }
            fontSize={16}
          />
          <BtnToday />
        </View>
        <TouchableWithoutFeedback onPress={onPressRefreshCalendar}>
          <View>
            <SvgIcon name="Refresh" size={24} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.layout,
  },
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default ScheduleHeader;
