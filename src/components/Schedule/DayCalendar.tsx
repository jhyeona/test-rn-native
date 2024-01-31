import moment from 'moment';
import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {COLORS} from '../../constants/colors.ts';
import {useRecoilState} from 'recoil';
import globalState from '../../recoil/Global/index.ts';
import {StudentInfoProps} from '../../types/user.ts';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import DayScheduleTable from './DayScheduleTable.tsx';

const screenWidth = Dimensions.get('window').width;

interface Props {
  studentInfo: StudentInfoProps;
  navigation: BottomTabNavigationHelpers;
}

const DayCalendar = (props: Props) => {
  const {studentInfo, navigation} = props;
  const [selectedDate, setSelectedDate] = useRecoilState(
    globalState.selectDayScheduleDate,
  );
  const [currentDate, setCurrentDate] = useState(moment(selectedDate)); // selected 했을 때 또는 이전/다음 주로 바꿨을 때 바뀐 주의 날짜 (해당 날짜의 한주 날짜를 렌더링함)
  const [headerUpdateCounter, setHeaderUpdateCounter] = useState(0); // header를 리렌더링 하기 위함

  const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];

  const handleDayClick = (index: number) => {
    const selectDate = currentDate.clone().weekday(index);
    setSelectedDate(selectDate.format('YYYY-MM-DD'));
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
          const isToday = date.isSame(moment(), 'day');
          return (
            <TouchableOpacity
              key={index}
              style={styles.headerCell}
              onPress={() => handleDayClick(index + 1)}>
              <View
                style={[
                  styles.headerCellInner,
                  selected && styles.selectedHeaderCell,
                ]}>
                <Text
                  style={{
                    color: selected
                      ? 'white'
                      : isToday
                        ? COLORS.primary
                        : 'black',
                    fontSize: 14,
                    fontWeight: '500',
                  }}>
                  {day}
                </Text>
                <Text
                  style={{
                    marginTop: 4,
                    color: selected
                      ? 'white'
                      : isToday
                        ? COLORS.primary
                        : 'black',
                    fontSize: 18,
                    fontWeight: '600',
                  }}>
                  {date.format('DD')}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderBody = () => {
    return (
      <ScrollView
        contentContainerStyle={{width: screenWidth - 48}}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScrollEndDrag={handleBodyScroll}
        pagingEnabled
        scrollEventThrottle={16}>
        <DayScheduleTable navigation={navigation} studentInfo={studentInfo} />
      </ScrollView>
    );
  };

  const handleBodyScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const isNext = offsetX > 0 ? 1 : -1; // true : 다음주 / false: 이전 주
    const nextWeekFirstDay = moment(selectedDate).add(isNext, 'week');

    setHeaderUpdateCounter(prev => prev + isNext);
    setCurrentDate(nextWeekFirstDay);
    setSelectedDate(moment(nextWeekFirstDay).format('YYYY-MM-DD'));
  };

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
  },
  headerCell: {
    flex: 1,
  },
  headerCellInner: {
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  selectedHeaderCell: {
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
  },
});

export default DayCalendar;
