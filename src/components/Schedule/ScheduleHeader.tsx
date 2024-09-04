import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';

import moment from 'moment/moment';

import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {COLORS} from '#constants/colors.ts';
import {weekOfMonth} from '#utils/scheduleHelper.ts';

interface ScheduleHeaderProps {
  isWeekend: boolean;
}

const ScheduleHeader = ({isWeekend}: ScheduleHeaderProps) => {
  const onPressRefreshCalendar = () => {
    console.log('onPressRefreshCalendar');
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <View style={styles.title}>
          <CText
            text={isWeekend ? '주간 일정' : '오늘 일정'}
            fontWeight="700"
            fontSize={22}
          />
          <SvgIcon name="Calendar" size={24} />
          <CText
            text={
              isWeekend ? weekOfMonth(moment()) : moment().format('YYYY.MM.DD')
            }
            fontSize={16}
          />
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
    gap: 6,
  },
});

export default ScheduleHeader;
