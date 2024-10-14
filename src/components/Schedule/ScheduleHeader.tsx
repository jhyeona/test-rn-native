import React from 'react';
import {StyleSheet, View} from 'react-native';

import {useRecoilValue} from 'recoil';

import BtnToday from '#components/Calendar/BtnToday.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import scheduleState from '#recoil/Schedule';

const ScheduleHeader = () => {
  const {isWeekly} = useRecoilValue(scheduleState.selectedCalendarDate);

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
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 15,
          }}>
          <BtnToday />
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
