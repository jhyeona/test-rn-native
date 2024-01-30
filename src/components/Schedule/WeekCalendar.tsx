import moment from 'moment';
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import {COLORS} from '../../constants/colors.ts';

const screenWidth = Dimensions.get('window').width;
const cellWidth = (screenWidth - 48) / 7;

interface Props {
  initialDate: string;
  onDayClick: (day: string) => void;
}

const WeekCalendar = (props: Props) => {
  const {onDayClick, initialDate} = props;
  const [selectedDate, setSelectedDate] = useState(moment()); // day : 날짜의 index (요일과 맞추기 위함)
  const [selectedDay, setSelectedDay] = useState(moment().day()); // day : 날짜의 index (요일과 맞추기 위함)
  const [currentDate, setCurrentDate] = useState(moment(initialDate)); // 바뀐 주의 날짜 (해당 날짜의 한주 날짜를 렌더링함)
  const [scrollX] = useState(new Animated.Value(0));
  const scrollViewRef = useRef<ScrollView>(null);
  const [headerUpdateCounter, setHeaderUpdateCounter] = useState(0); //

  const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];

  const handleDayClick = (index: number) => {
    const selectDate = currentDate.clone().weekday(index);

    setSelectedDay(index);
    setSelectedDate(selectDate);
    onDayClick(selectDate.format('YYYYMMDD'));
  };

  const renderHeader = (setDate: moment.Moment) => {
    const isSunday = setDate.day() === 0;

    const startOfSunday = setDate.clone().add(-1, 'day').startOf('week');
    const startOfDefault = setDate.clone().startOf('week');

    return (
      <View style={styles.headerContainer}>
        {daysOfWeek.map((day, index) => {
          const date = isSunday
            ? startOfSunday.clone().add(index + 1, 'day')
            : startOfDefault.clone().add(index + 1, 'day');
          const selected = date.isSame(selectedDate, 'day');
          return (
            <TouchableOpacity
              key={index}
              style={[styles.headerCell, selected && styles.selectedHeaderCell]}
              onPress={() => handleDayClick(index + 1)}>
              <Text
                style={{
                  color: selected ? 'white' : 'black',
                  fontSize: 14,
                  fontWeight: '500',
                }}>
                {day}
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  color: selected ? 'white' : 'black',
                  fontSize: 18,
                  fontWeight: '600',
                }}>
                {date.format('DD')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderBody = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onScrollEndDrag={handleBodyScroll}
        pagingEnabled
        scrollEventThrottle={16}
        ref={scrollViewRef}>
        <Animated.View
          style={{flexDirection: 'row', transform: [{translateX: scrollX}]}}>
          {daysOfWeek.map((day, index) => (
            <View key={index} style={styles.bodyCell}>
              <Text>DD</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    );
  };

  const handleBodyScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const isNext = offsetX > 0 ? 1 : -1; // true : 다음주 / false: 이전 주
    const nextWeekFirstDay = currentDate.add(isNext, 'week');
    console.log(nextWeekFirstDay);

    setHeaderUpdateCounter(prev => prev + isNext);
    setCurrentDate(nextWeekFirstDay);
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: cellWidth * (selectedDay - 1),
        animated: true,
      });
    }
  }, [selectedDay]);

  return (
    <View style={styles.container}>
      {renderHeader(currentDate)}
      {renderBody()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    // borderBottomWidth: 1,
    // borderColor: 'black',
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  selectedHeaderCell: {
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
  },
  bodyCell: {
    width: cellWidth,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
});

export default WeekCalendar;
