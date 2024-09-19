import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {useRecoilValue, useSetRecoilState} from 'recoil';

import BtnToday from '#components/Calendar/BtnToday.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {COLORS} from '#constants/colors.ts';
import {useGetDaySchedule} from '#containers/DailySchedules/hooks/useApi.ts';
import GlobalState from '#recoil/Global';
import scheduleState from '#recoil/Schedule';
import {weekOfMonth} from '#utils/scheduleHelper.ts';

const ScheduleHeader = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const {isWeekly, date} = useRecoilValue(scheduleState.selectedCalendarDate);
  const selectAcademy = useRecoilValue(GlobalState.selectedAcademy); // 선택된 기관

  const {refetchDaySchedule} = useGetDaySchedule({
    academyId: selectAcademy,
    date: date.format('YYYYMMDD'),
  });

  // 새로고침
  const onPressRefreshCalendar = () => {
    setIsLoading(true);
    setTimeout(() => {
      refetchDaySchedule().then(() => {
        setIsLoading(false);
      });
    }, 50);
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
            }
            fontSize={16}
          />
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 15,
          }}>
          <BtnToday />
          <TouchableOpacity onPress={onPressRefreshCalendar}>
            <View>
              <SvgIcon name="Refresh" size={24} />
            </View>
          </TouchableOpacity>
        </View>
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
