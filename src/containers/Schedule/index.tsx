import React, {useEffect, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  View,
} from 'react-native';
import moment from 'moment';
import 'moment/locale/ko';
import DayScheduleTable from '../../components/Schedule/DayScheduleTable.tsx';
import {useRecoilValue} from 'recoil';
import userState from '../../recoil/user';
import {
  useGetDaySchedule,
  useGetWeekSchedule,
} from '../../hooks/useSchedule.ts';
import {useGetUserInfo} from '../../hooks/useUser.ts';
import WeeklyCalendar from '../../components/Schedule/WeekCalendar.tsx';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {StudentInfoProps} from '../../types/user.ts';
import TimeTable from '../../components/Schedule/TimeTable.tsx';
import scheduleState from '../../recoil/Schedule';

const Schedule = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  const userData = useRecoilValue(userState.userInfoState);
  const dayScheduleData = useRecoilValue(scheduleState.dayScheduleState);
  const [isWeekend, setIsWeekend] = useState(false);
  const [selectDate, setSelectDate] = useState(moment());
  const [selectStudentInfo, setSelectStudentInfo] = useState<
    StudentInfoProps | undefined
  >(undefined);
  const [academyList, setAcademyList] = useState([{label: '', value: ''}]);
  const [selectAcademy, setSelectAcademy] = useState<number | undefined>(
    userData ? userData.studentList[0].academy.academyId : undefined,
  );

  useGetUserInfo(); //유저 정보
  useGetDaySchedule({
    // 일일 데이터
    academyId: selectAcademy,
    date: moment(selectDate).format('YYYYMMDD'),
  });
  useGetWeekSchedule({
    // 주간 데이터
    academyId: selectAcademy,
    date: moment(selectDate).format('YYYYMMDD'),
  });

  const onChangeDropList = (value: string) => {
    // 기관 리스트
    const studentInfo = userData?.studentList.filter(val => {
      return val.academy.academyId === Number(value);
    });
    setSelectStudentInfo(studentInfo && studentInfo[0]);
    setSelectAcademy(Number(value));
  };

  const onChangeDate = (date: string) => {
    // 일일 데이터 - 날짜 선택
    setSelectDate(moment(date));
  };

  const onChangeWeek = async (date: string) => {
    setSelectDate(moment(date));
  };

  const toggleSwitch = () => {
    // 일일 / 주간 토글 스위치
    setIsWeekend(!isWeekend);
  };

  const onPressHistory = () => {
    // 내 출석 기록 보기 페이지로 이동
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
    <SafeAreaView style={{flex: 1}}>
      <View style={{zIndex: 2}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}>
          {isWeekend ? (
            <>
              <Text>주간 일정</Text>
              <Text>2024.01</Text>
            </>
          ) : (
            <>
              <Text>오늘 일정</Text>
              <Text>{moment().format('YYYY.MM.DD')}</Text>
            </>
          )}
          <View>
            <Switch
              trackColor={{false: 'skyblue', true: 'gold'}}
              thumbColor={isWeekend ? 'gold' : 'skyblue'}
              ios_backgroundColor="white"
              onValueChange={toggleSwitch}
              value={isWeekend}
            />
          </View>
        </View>
        {/*<Dropdown*/}
        {/*  list={academyList}*/}
        {/*  onChangeValue={onChangeDropList}*/}
        {/*  disabled={userData ? userData.studentList.length <= 1 : false}*/}
        {/*/>*/}
      </View>
      {isWeekend ? (
        <View style={{flexGrow: 1}}>
          <TimeTable onChangeWeek={onChangeWeek} />
        </View>
      ) : (
        <>
          <WeeklyCalendar
            calendarType={isWeekend ? 'week' : 'day'}
            onChangeDate={onChangeDate}
          />
          {selectStudentInfo && (
            <DayScheduleTable
              navigation={navigation}
              headers={['시간', '예정 강의']}
              scheduleData={dayScheduleData ?? {scheduleList: []}}
              studentInfo={selectStudentInfo}
            />
          )}
        </>
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
    </SafeAreaView>
  );
};

export default Schedule;
