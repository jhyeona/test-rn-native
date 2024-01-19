// WeekCalendar.tsx
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import moment from 'moment';
import 'moment/locale/ko';
import {
  FlingGestureHandler,
  Directions,
  State,
} from 'react-native-gesture-handler';

interface Props {
  calendarType: string; // day: 일일 데이터 -> 날짜 선택 가능, 스와이프 시 날짜만 이동 / week: 주간 데이터 -> 날짜 선택 불가능, 스와이프 시 데이터 새로 고침
  onChangeDate: any;
}

const WeekCalendar = (props: Props) => {
  const {calendarType, onChangeDate} = props;
  const [weeks, setWeeks] = useState<string[][]>([]);
  const [selectDate, setSelectDate] = useState('');
  const [selectDateDay, setSelectDateDay] = useState<number>(moment().day()); // 날짜 선택시 해당 날짜의 인덱스 번호로 selected style 지정
  const [month, setMonth] = useState('');
  const windowWidth = Dimensions.get('window').width;
  const flatListRef = useRef<FlatList | null>(null);

  const generateWeeks = (startDate: moment.Moment) => {
    // 현재 주 +-1 주
    const test = startDate.isoWeekday(1);
    return Array.from({length: 3}, (_, weekIndex) => {
      const startOfWeek = test.clone().add(weekIndex - 1, 'weeks');
      return Array.from({length: 7}, (_, dayIndex) =>
        startOfWeek.clone().add(dayIndex, 'days').format('YYYY-MM-DD'),
      );
    });
  };

  const goToPreviousWeek = () => {
    const newPrevWeek = generateWeeks(moment(weeks[0][0]));
    setWeeks(newPrevWeek);
    setMonth(moment(weeks[0][0]).format('YYYY-MM'));
  };

  const goToNextWeek = () => {
    const newNextWeek = generateWeeks(moment(weeks[2][0]));
    setWeeks(newNextWeek);
  };

  const onSwipeRight = () => {
    // 이전 주로 스와이프
    goToPreviousWeek();
  };

  const onSwipeLeft = () => {
    // 다음 주로 스와이프
    goToNextWeek();
  };

  useEffect(() => {
    setSelectedDate(moment().format('YYYY-MM-DD'));
    setWeeks(generateWeeks(moment()));
  }, []);

  useEffect(() => {
    weeks.length > 0 && setMonth(moment(weeks[1][0]).format('YYYY년 MM월'));
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({animated: false, index: 1});
    }, 100);
  }, [weeks]);

  const renderItem = ({item}: {item: string[]}) => {
    const dayContainerWidth = windowWidth / 7;
    return (
      <TouchableOpacity style={styles.weekContainer}>
        {item.map((day, index) => {
          const isToday = moment(day).isSame(moment(), 'day');
          const isSelected =
            moment(day).format('YYYY-MM-DD') === weeks[1][selectDateDay - 1];
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedDate(day)}
              style={[
                styles.dayContainer,
                {width: dayContainerWidth},
                isSelected && styles.selectedDayContainer,
              ]}>
              <Text>{moment(day).format('dd')}</Text>
              <Text style={[styles.dayText, isToday && styles.todayText]}>
                {moment(day).format('DD')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </TouchableOpacity>
    );
  };

  const setSelectedDate = (date: string) => {
    if (calendarType === 'day') {
      let day = moment(date).day();
      if (day === 0) day = 7; // 일요일일 경우
      setSelectDateDay(day);
      setSelectDate(date);
      onChangeDate(date);
      return;
    }
  };

  return (
    <FlingGestureHandler
      direction={Directions.LEFT}
      onHandlerStateChange={e => {
        // console.log('test', e.nativeEvent.state);
        if (e.nativeEvent.state === State.ACTIVE) {
          onSwipeLeft();
        }
      }}>
      <FlingGestureHandler
        direction={Directions.RIGHT}
        onHandlerStateChange={e => {
          if (e.nativeEvent.state === State.ACTIVE) {
            onSwipeRight();
          }
        }}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={goToPreviousWeek}>
              <Text style={styles.arrowText}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.dateText}>{month}</Text>
            <TouchableOpacity onPress={goToNextWeek}>
              <Text style={styles.arrowText}>{'>'}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            ref={ref => (flatListRef.current = ref)}
            horizontal
            data={weeks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.flatListContainer}
            // pagingEnabled={true}
            // showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            getItemLayout={(data, index) => ({
              length: windowWidth,
              offset: windowWidth * index,
              index,
            })}
          />
        </View>
      </FlingGestureHandler>
    </FlingGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    // height: 100,
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  arrowText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  flatListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  selectedDayContainer: {
    backgroundColor: 'skyblue',
  },
  dayText: {
    fontSize: 18,
  },
  todayText: {
    fontWeight: 'bold',
    color: 'red',
  },
  dateText: {
    fontSize: 16,
  },
});

export default WeekCalendar;
