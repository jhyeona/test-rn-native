import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Moment} from 'moment/moment';

import CText from '#components/common/CustomText/CText.tsx';
import {WEEKLY_SCHEDULE_LEFT_WIDTH} from '#constants/calendar.ts';
import {COLORS} from '#constants/colors.ts';
import {getDatesOfWeek, getIsToday} from '#utils/scheduleHelper.ts';

const DaysLabel = ({date}: {date: Moment}) => {
  const [dateList, setDateList] = useState<Moment[]>([]);

  useEffect(() => {
    const list = getDatesOfWeek(date);
    setDateList(list);
  }, [date]);

  return (
    <View style={styles.dateContainer}>
      {dateList.map((day, i) => {
        const isToday = getIsToday(day);
        return (
          <View style={styles.date} key={`schedule-table-date-${i}`}>
            {isToday && <View style={styles.isToday} />}
            <CText text={day.format('dd')} />
            <CText text={day.format('DD')} fontSize={16} fontWeight="600" />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: WEEKLY_SCHEDULE_LEFT_WIDTH,
  },
  date: {
    flex: 1,
    marginVertical: 10,
    alignItems: 'center',
    position: 'relative',
  },
  isToday: {
    position: 'absolute',
    top: -2,
    right: 2,
    width: 7,
    height: 7,
    borderRadius: 80,
    backgroundColor: COLORS.primary,
  },
});
export default DaysLabel;
