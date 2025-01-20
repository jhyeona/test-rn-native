import {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {DAY_SCHEDULE_FIRST_CELL_WIDTH} from '#constants/calendar.ts';
import {COLORS} from '#constants/colors.ts';
import DaySchedulesLecture from '#containers/DailySchedules/components/DaySchedulesLecture.tsx';
import DaySchedulesTime from '#containers/DailySchedules/components/DaySchedulesTime.tsx';
import {ScheduleDefaultProps} from '#types/schedule.ts';

interface DaySchedulesItemProps {
  item: ScheduleDefaultProps;
  index: number;
}

const DaySchedulesItem = ({item, index}: DaySchedulesItemProps) => {
  return (
    <View key={`day-schedule-time-item-${index}`} style={styles.row}>
      <DaySchedulesTime scheduleData={item} style={[styles.cell, styles.cellFirst]} />
      <View style={[styles.cell]}>
        <DaySchedulesLecture scheduleData={item} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    padding: 14,
  },
  cellFirst: {
    paddingHorizontal: 0,
    flex: 0,
    width: DAY_SCHEDULE_FIRST_CELL_WIDTH,
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: COLORS.lineBlue,
  },
});
export default memo(DaySchedulesItem);
