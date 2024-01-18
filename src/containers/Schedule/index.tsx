import React, {useEffect, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import moment from 'moment';
import 'moment/locale/ko';
import DayScheduleTable from '../../components/Schedule/DayScheduleTable.tsx';
import WeekScheduleTable from '../../components/Schedule/WeekScheduleTable.tsx';
import Dropdown from '../../components/common/Dropdown.tsx';
import {useRecoilValue} from 'recoil';
import userState from '../../recoil/user';
import {useGetDaySchedule} from '../../hooks/useSchedule.ts';
import {useGetUserInfo} from '../../hooks/useUser.ts';
import scheduleState from '../../recoil/Schedule';
import WeeklyCalendar from '../../components/common/WeekCalendar.tsx';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

const Schedule = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  const userData = useRecoilValue(userState.userInfoState);
  // const dayScheduleData = useRecoilValue(scheduleState.dayScheduleState);
  const [isWeekend, setIsWeekend] = useState(false);
  const [selectDate, setSelectDate] = useState(moment());
  const [academyList, setAcademyList] = useState([{label: '', value: ''}]);
  const [selectAcademy, setSelectAcademy] = useState<number | undefined>(
    userData ? userData.studentList[0].academy.academyId : undefined,
  );

  const dayScheduleData = {
    scheduleList: [
      {
        scheduleId: 1,
        scheduleParentId: null,
        scheduleStartTime: '2024-01-16T18:35:00',
        scheduleMinutes: 50,
        lecture: {
          lectureId: 1,
          lectureName: 'Java 테스트',
          lectureAllowMinus: 5,
          lectureAllowPlus: 5,
          lectureAllowLatePlus: 0,
          lectureCheckInterval: 60,
        },
      },
    ],
  };

  useGetUserInfo();
  useGetDaySchedule({
    academyId: selectAcademy,
    date: moment(selectDate).format('YYYYMMDD'),
  });

  const onChangeDropList = (value: string) => {
    setSelectAcademy(Number(value));
  };

  const onChangeDate = (date: string) => {
    setSelectDate(moment(date));
  };

  const toggleSwitch = () => {
    setIsWeekend(!isWeekend);
  };

  const onPressHistory = () => {
    navigation.navigate('ScheduleHistory');
  };

  useEffect(() => {
    if (userData) {
      const newList: Array<{label: string; value: string}> = [];
      userData?.studentList.map(val => {
        newList.push({
          label: val.academy.name,
          value: String(val.academy.academyId),
        });
      });
      setAcademyList(newList);
    }
  }, [userData]);

  return (
    <SafeAreaView>
      <ScrollView>
        <Dropdown
          list={academyList}
          onChangeValue={onChangeDropList}
          disabled={userData ? userData.studentList.length <= 1 : false}
        />
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
        <WeeklyCalendar onChangeDate={onChangeDate} />
        {isWeekend ? (
          <WeekScheduleTable />
        ) : (
          <DayScheduleTable
            navigation={navigation}
            headers={['시간', '예정 강의']}
            data={dayScheduleData ?? {scheduleList: []}}
          />
        )}
        <Pressable
          onPress={onPressHistory}
          style={{
            backgroundColor: 'lightgrey',
            alignItems: 'center',
            margin: 10,
            padding: 10,
          }}>
          <Text>내 출석 기록 보기</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Schedule;
