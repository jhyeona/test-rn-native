import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

import moment from 'moment';
import {useRecoilValue} from 'recoil';

import CText from '#components/common/CustomText/CText.tsx';
import {COLORS} from '#constants/colors.ts';
import {CalendarItem} from '#containers/DailySchedules/utils/dateHelper.ts';
import scheduleState from '#recoil/Schedule';
import {getIsToday} from '#utils/scheduleHelper.ts';

interface RenderItemProps {
  item: CalendarItem;
  itemWidth: number;
  onPressDate: (params: {item: CalendarItem}) => void;
}

const WeeklyCalendarItem: React.FC<RenderItemProps> = ({
  item,
  itemWidth,
  onPressDate,
}) => {
  const {date, isWeekly} = useRecoilValue(scheduleState.selectedCalendarDate);

  const isToday = getIsToday(item.date);
  const isSelected = item.date.isSame(date, 'day');

  const textColor = isSelected ? 'white' : isToday ? COLORS.primary : 'black';
  const fontWeight = isSelected ? '700' : '600';

  return (
    <TouchableOpacity
      style={{width: itemWidth, borderRadius: 7}}
      onPress={() => onPressDate({item})}
      disabled={isWeekly}>
      <View
        style={[styles.dateContainer, isSelected && styles.selectedContainer]}>
        <View
          style={[
            styles.todayDot,
            {
              display: isToday ? 'flex' : 'none',
              backgroundColor: isSelected ? 'white' : COLORS.primary,
            },
          ]}
        />
        <CText
          text={item.date.format('ddd')}
          color={textColor}
          fontWeight={fontWeight}
          style={styles.date}
        />
        <CText
          text={item.date.format('D')}
          color={textColor}
          fontWeight={fontWeight}
          fontSize={17}
          style={styles.date}
          lineBreak
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dateContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    paddingBottom: 7,
    paddingTop: 14,
    borderRadius: 7,
    gap: 5,
  },
  selectedContainer: {
    borderRadius: 7,
    backgroundColor: COLORS.primary,
  },
  date: {
    textAlign: 'center',
  },
  todayDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 10,
  },
});

export default WeeklyCalendarItem;
