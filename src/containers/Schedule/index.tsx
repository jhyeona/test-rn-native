import React, {useEffect, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import 'moment/locale/ko';
import DayScheduleTable from '../../components/Schedule/DayScheduleTable.tsx';
import {DayScheduleProps} from '../../types/schedule.ts';
import WeekScheduleTable from '../../components/Schedule/WeekScheduleTable.tsx';
import Dropdown from '../../components/common/Dropdown.tsx';

const Schedule = () => {
  const [isWeekend, setIsWeekend] = useState(false);
  const [selectDate, setSelectDate] = useState(moment());
  const [dropDownValue, setDropDownValue] = useState({label: '', value: ''});

  const toggleSwitch = () => {
    setIsWeekend(!isWeekend);
  };

  // let datesWhitelist = [
  //   {
  //     start: moment(),
  //     end: moment().add(3, 'days'), // total 4 days enabled
  //   },
  // ];
  const datesBlacklist = [
    {
      start: moment().add(1, 'days'),
      end: moment().add(3, 'days'),
    },
  ];

  const onDateSelected = async (selectedDate: moment.Moment) => {
    const date = moment(selectedDate);
    setSelectDate(date);
  };

  const dayHeaders = ['시간', '예정 강의'];
  const scheduleData: DayScheduleProps = {
    scheduleList: [
      {
        scheduleId: 1,
        scheduleParentId: null,
        lectureId: 1,
        lectureName: 'Java 테스트',
        scheduleStartTime: '2024-01-15T11:00:00',
        scheduleMinutes: 50,
      },
      {
        scheduleId: 2,
        scheduleParentId: 1,
        lectureId: 1,
        lectureName: 'Java 테스트',
        scheduleStartTime: '2024-01-15T13:00:00',
        scheduleMinutes: 50,
      },
    ],
  };
  const dropList = [
    {label: '기관1', value: '1'},
    {label: '기관2', value: '2'},
    {label: '기관3', value: '3'},
  ];
  const onChangeDropList = (selectedValue: {label: string; value: string}) => {
    setDropDownValue(selectedValue);
    console.log('selected:', dropDownValue.label);
  };

  return (
    <SafeAreaView>
      <Dropdown list={dropList} setDropDownList={onChangeDropList} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 30,
        }}>
        {isWeekend ? (
          <>
            <Text>주간 일정</Text>
            <Text>2024.01</Text>
          </>
        ) : (
          <>
            <Text>오늘 일정</Text>
            <Text>2024.01.01</Text>
          </>
        )}
        <View>
          <Text>오늘/주간 설정</Text>
          <Switch
            trackColor={{false: 'skyblue', true: 'gold'}}
            thumbColor={isWeekend ? 'gold' : 'skyblue'}
            ios_backgroundColor="white"
            onValueChange={toggleSwitch}
            value={isWeekend}
          />
        </View>
      </View>
      <CalendarStrip
        scrollable
        scrollerPaging
        calendarAnimation={{type: 'parallel', duration: 300}}
        style={{height: 100, paddingTop: 20, paddingBottom: 10}}
        calendarHeaderStyle={{color: 'black'}}
        calendarColor={'white'}
        dateNumberStyle={{color: 'black'}}
        dateNameStyle={{color: 'black'}}
        highlightDateContainerStyle={styles.highlightDateContainerStyle}
        highlightDateNumberStyle={{color: 'black'}}
        highlightDateNameStyle={{color: 'black'}}
        disabledDateNameStyle={{color: 'grey'}}
        disabledDateNumberStyle={{color: 'grey'}}
        // datesWhitelist={datesWhitelist}
        datesBlacklist={datesBlacklist}
        selectedDate={selectDate}
        maxDate={moment().add(3, 'days')}
        onDateSelected={selectedDate => onDateSelected(selectedDate)}
        iconLeft={require('../../assets/logo.png')}
        iconRight={require('../../assets/logo.png')}
        iconContainer={{flex: 0.1}}
        calendarHeaderFormat="YYYY년 M월"
        scrollToOnSetSelectedDate
      />
      {isWeekend ? (
        <WeekScheduleTable />
      ) : (
        <DayScheduleTable headers={dayHeaders} data={scheduleData} />
      )}
      <Pressable
        style={{
          backgroundColor: 'lightgrey',
          alignItems: 'center',
          margin: 10,
          padding: 10,
        }}>
        <Text>내 출석 기록 보기</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  highlightDateContainerStyle: {
    backgroundColor: 'skyblue',
    borderRadius: 10,
  },
});

export default Schedule;
