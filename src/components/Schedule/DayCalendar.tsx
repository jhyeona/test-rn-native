import moment from 'moment';
import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useRecoilState} from 'recoil';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import globalState from '#recoil/Global/index.ts';
import {StudentInfoProps} from '#types/user.ts';
import {COLORS} from '#constants/colors.ts';
import DayScheduleTable from '#components/Schedule/DayScheduleTable.tsx';
import {IS_IOS} from '#constants/common.ts';
import CText from '#components/common/CustomText/CText.tsx';
import {useChangeWidth} from '#hooks/useGlobal.ts';

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

  const handleDayClick = (index: number, isSunday: boolean) => {
    const selectDate = currentDate
      .clone()
      .add(isSunday ? -1 : 0, 'day')
      .weekday(index);
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
              onPress={() => handleDayClick(index + 1, isSunday)}>
              <View
                style={[
                  styles.headerCellInner,
                  selected && styles.selectedHeaderCell,
                ]}>
                <CText
                  style={{
                    color: selected
                      ? 'white'
                      : isToday
                        ? COLORS.primary
                        : 'black',
                  }}
                  color={
                    selected ? 'white' : isToday ? COLORS.primary : 'black'
                  }
                  text={day}
                  fontWeight="500"
                />
                <CText
                  style={{marginTop: 4}}
                  color={
                    selected ? 'white' : isToday ? COLORS.primary : 'black'
                  }
                  fontSize={18}
                  fontWeight="600"
                  text={date.format('DD')}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  const changeWidth = useChangeWidth();
  const renderBody = () => {
    return (
      <ScrollView
        contentContainerStyle={{width: screenWidth - 48}}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScrollEndDrag={handleBodyScroll}
        pagingEnabled
        scrollEventThrottle={16}>
        <View style={{width: changeWidth}}>
          <DayScheduleTable navigation={navigation} studentInfo={studentInfo} />
        </View>
      </ScrollView>
    );
  };

  const handleBodyScroll = (event: any) => {
    const velocity = event.nativeEvent.velocity.x; // velocity 값이 양수이면 IOS 는 좌 -> 우 / ANDROID 는 우 -> 좌

    let isNext = 0;
    if (velocity > 0) {
      IS_IOS ? (isNext = 1) : (isNext = -1);
    } else if (velocity < 0) {
      IS_IOS ? (isNext = -1) : (isNext = 1);
    }
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
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
});

export default DayCalendar;
