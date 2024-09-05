import React, {useMemo} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

import moment from 'moment';
import {useRecoilValue} from 'recoil';

import CText from '#components/common/CustomText/CText.tsx';
import {COLORS} from '#constants/colors.ts';
import {CalendarItem} from '#containers/DailySchedules/utils/dateHelper.ts';
import scheduleState from '#recoil/Schedule';

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
  const {date} = useRecoilValue(scheduleState.selectedCalendarDate);

  const isToday = useMemo(() => moment().isSame(item.date, 'day'), [item.date]);
  const isSelected = item.date.isSame(date, 'day');

  const textColor = isSelected ? 'white' : isToday ? COLORS.primary : 'black';
  const fontWeight = isSelected ? '700' : '600';

  return (
    <TouchableOpacity
      style={{width: itemWidth}}
      onPress={() => onPressDate({item})}>
      <View
        style={[styles.dateContainer, isSelected && styles.selectedContainer]}>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    paddingVertical: 7,
    borderRadius: 7,
    gap: 5,
  },
  selectedContainer: {
    backgroundColor: COLORS.primary,
  },
  date: {
    textAlign: 'center',
  },
});

export default WeeklyCalendarItem;
