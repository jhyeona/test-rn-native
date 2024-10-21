import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import moment from 'moment';
import {useRecoilState, useSetRecoilState} from 'recoil';

import CButton from '#components/common/CommonButton/CButton.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import {COLORS} from '#constants/colors.ts';
import {DATE_FORMAT} from '#constants/common.ts';
import {isDateInSameWeek} from '#containers/WeeklySchedules/utils/scheduleHelper.ts';
import GlobalState from '#recoil/Global';
import scheduleState from '#recoil/Schedule';
// import SvgIcon from '#components/common/Icon/Icon.tsx';

const BtnToday = () => {
  const setToast = useSetRecoilState(GlobalState.globalToastState);
  const [{isWeekly, date}, setDate] = useRecoilState(
    scheduleState.selectedCalendarDate,
  );

  const showToast = (message: string) => {
    setToast({
      time: 1500,
      isVisible: true,
      message,
    });
  };

  const onPressSetToday = () => {
    // 주간 일정일 경우에는 이번주 내의 날짜인지 확인
    const isOnWeek =
      isWeekly &&
      isDateInSameWeek(new Date(date.format(DATE_FORMAT)), new Date());
    if (isOnWeek) {
      showToast('이번 주 일자 입니다.');
      return;
    }
    if (date.isSame(moment(), 'day')) {
      showToast('오늘 일자 입니다.');
      return;
    }
    setDate(prev => ({...prev, date: moment()}));
  };

  return (
    <TouchableOpacity onPress={onPressSetToday} style={styles.todayWrapper}>
      {/*<SvgIcon name="TodayArrow" />*/}
      {/*<CText text="오늘" />*/}
      <View style={styles.todayDot} />
      <CText text="오늘" style={{marginRight: 8}} fontWeight="700" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  todayWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayDot: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
});

export default BtnToday;
