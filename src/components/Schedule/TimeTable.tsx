// import React from 'react';
// import {View, Text, StyleSheet} from 'react-native';
//
// const TimeTable = () => {
//   const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];
//   const startTime = '09:00';
//   const endTime = '12:30';
//
//   const timeSlots = [];
//   let current = new Date(`2021-01-01 ${startTime}`);
//
//   while (current <= new Date(`2021-01-01 ${endTime}`)) {
//     const formattedTime = `${current
//       .getHours()
//       .toString()
//       .padStart(2, '0')}:${current.getMinutes().toString().padStart(2, '0')}`;
//     timeSlots.push(formattedTime);
//
//     // Add 10 minutes
//     current.setMinutes(current.getMinutes() + 10);
//   }
//
//   return (
//     <View style={styles.container}>
//       <View style={styles.timeColumn}>
//         {timeSlots.map(formattedTime => (
//           <View key={formattedTime} style={styles.timeCell}>
//             <Text>{formattedTime}</Text>
//           </View>
//         ))}
//       </View>
//       <View style={styles.weekColumns}>
//         {daysOfWeek.map((day, index) => (
//           <View key={day} style={styles.dayColumn} />
//         ))}
//       </View>
//     </View>
//   );
// };
//
// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//   },
//   timeColumn: {
//     marginRight: 10,
//     borderRightWidth: 1,
//     borderColor: 'gray',
//   },
//   timeCell: {
//     height: 40, // 고정된 높이
//     borderBottomWidth: 1,
//     borderColor: 'gray',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dayColumn: {
//     flex: 1,
//     padding: 10,
//     borderRightWidth: 1,
//     borderColor: 'gray',
//     height: 40, // 고정된 높이
//   },
//   weekColumns: {
//     flex: 1,
//     flexDirection: 'row',
//   },
// });
//
// export default TimeTable;

import React, {useEffect, useMemo, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
  EventItem,
  HighlightDates,
  MomentConfig,
  TimelineCalendar,
} from '@howljs/calendar-kit';
import moment from 'moment/moment';

const fetchData = (props: {from: string; to: string}) =>
  new Promise<EventItem[]>(resolve => {
    //Fake api
    setTimeout(() => {
      // console.log(props);
      resolve([]);
    }, 1000);
  });

const TimeTable = () => {
  const exampleEvents: EventItem[] = [
    {
      id: '1',
      title: 'Event 1',
      start: moment().toISOString(),
      end: moment().add(1, 'hour').toISOString(),
      color: '#A3C7D6',
    },
    {
      id: '2',
      title: 'Event 2',
      start: '2024-01-18T11:00:05.313Z',
      end: '2024-01-18T14:00:05.313Z',
      color: '#B1AFFF',
    },
  ];

  const [events, setEvents] = useState<EventItem[]>(exampleEvents);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const numOfDays = 7;
    const fromDate = new Date();
    const toDate = new Date();
    toDate.setDate(new Date().getDate() + numOfDays);
    fetchData({
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
    })
      .then(res => {
        setEvents(prev => [...prev, ...res]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  MomentConfig.updateLocale('ko', {
    weekdaysShort: '일_월_화_수_목_금_토'.split('_'),
  });

  const onPressDayNum = (date: string) => {
    console.log(date);
  };

  const _onDateChanged = (date: string) => {
    setIsLoading(true);
    const numOfDays = 7;
    const fromDate = new Date(date);
    const toDate = new Date(date);
    toDate.setDate(toDate.getDate() + numOfDays);
    fetchData({
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
    })
      .then(res => {
        setEvents(prev => [...prev, ...res]);
      })
      .finally(() => {
        setIsLoading(false);
      });
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

  return (
    <SafeAreaView style={styles.container}>
      <TimelineCalendar
        viewMode="week"
        events={exampleEvents}
        isLoading={isLoading}
        highlightDates={highlightDates}
        // onDateChanged={_onDateChanged}
        onPressDayNum={date => onPressDayNum(date)}
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
