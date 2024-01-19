import React, {useEffect, useMemo, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
  EventItem,
  HighlightDates,
  MomentConfig,
  TimelineCalendar,
} from '@howljs/calendar-kit';
import moment from 'moment/moment';
import {WeekScheduleProps} from '../../types/schedule.ts';

interface Props {
  weekData: WeekScheduleProps;
  onChangeWeek: (date: string) => void;
}
const TimeTable = (props: Props) => {
  const {weekData, onChangeWeek} = props;

  const dummyData = {
    scheduleBunchList: [
      {
        lecture: {
          lectureId: 1,
          lectureName: 'Java 테스트',
          lectureStartDate: '2024-01-01',
          lectureEndDate: '2024-10-31',
          lectureAllowMinus: 5,
          lectureAllowPlus: 5,
          lectureAllowLatePlus: 0,
          lectureCheckInterval: 60,
        },
        scheduleBunchStartTime: '2024-01-17T12:10:00',
        scheduleBunchMinutes: 220,
      },
      {
        lecture: {
          lectureId: 1,
          lectureName: 'Java 테스트',
          lectureStartDate: '2024-01-01',
          lectureEndDate: '2024-10-31',
          lectureAllowMinus: 5,
          lectureAllowPlus: 5,
          lectureAllowLatePlus: 0,
          lectureCheckInterval: 60,
        },
        scheduleBunchStartTime: '2024-01-19T09:10:00',
        scheduleBunchMinutes: 120,
      },
    ],
  };

  const formattedData = () => {
    const formatted: EventItem[] = [];
    dummyData.scheduleBunchList.map((info, i) => {
      formatted.push({
        id: i.toString(),
        title: info.lecture.lectureName,
        start: moment(info.scheduleBunchStartTime).toISOString(),
        end: moment(info.scheduleBunchStartTime)
          .add(info.scheduleBunchMinutes, 'minutes')
          .toISOString(),
        color: '#A3C7D6',
      });
    });
    return formatted;
  };

  const [events, setEvents] = useState<EventItem[]>(formattedData());
  const [isLoading, setIsLoading] = useState(true);

  MomentConfig.updateLocale('ko', {
    weekdaysShort: '일_월_화_수_목_금_토'.split('_'),
  });

  const _onDateChanged = (date: string) => {
    // setIsLoading(true);
    const numOfDays = 7;
    const fromDate = new Date(date);
    const toDate = new Date(date);
    toDate.setDate(toDate.getDate() + numOfDays);
    onChangeWeek(moment(fromDate).format('YYYYMMDD'));
    // setIsLoading(false);
  };

  const highlightDates: HighlightDates = useMemo(
    // 공휴일 색 표시할 때 사용
    () => ({
      '2024-02-09': {
        dayNameColor: 'red',
        dayNumberColor: 'red',
        dayNumberBackgroundColor: '#FFF',
      },
    }),
    [],
  );

  const theme = {
    //Saturday style
    saturdayName: {color: 'blue'},
    saturdayNumber: {color: 'blue'},
    saturdayNumberContainer: {backgroundColor: 'white'},

    //Sunday style
    sundayName: {color: 'red'},
    sundayNumber: {color: 'red'},
    sundayNumberContainer: {backgroundColor: 'white'},

    //Today style
    todayName: {color: 'green', fontWeight: 'bold'},
    todayNumber: {color: 'green', fontWeight: 'bold'},
    todayNumberContainer: {backgroundColor: 'transparent'},

    //Normal style
    dayName: {color: 'black'},
    dayNumber: {color: 'black'},
    dayNumberContainer: {backgroundColor: 'white'},

    //Loading style
    loadingBarColor: '#D61C4E',
  };

  useEffect(() => {
    setIsLoading(false);
  }, [events]);

  return (
    <SafeAreaView style={styles.container}>
      <TimelineCalendar
        viewMode="week"
        events={events}
        isLoading={isLoading}
        highlightDates={highlightDates}
        onDateChanged={_onDateChanged}
        // onPressDayNum={date => onPressDayNum(date)}
        locale="ko"
        start={9}
        end={24}
        firstDay={1}
        maxDate={moment().add(1, 'week').isoWeekday(0).format('YYYY-MM-DD')}
        theme={theme}
        showNowIndicator
        scrollToNow
        allowPinchToZoom //확대
        initialTimeIntervalHeight={40}
        minTimeIntervalHeight={29}
        maxTimeIntervalHeight={110}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF'},
});

export default TimeTable;
