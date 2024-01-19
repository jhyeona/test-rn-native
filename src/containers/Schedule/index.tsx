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
import Dropdown from '../../components/common/Dropdown.tsx';
import {useRecoilValue} from 'recoil';
import userState from '../../recoil/user';
import {
  getWeekSchedule,
  useGetDaySchedule,
  useGetWeekSchedule,
} from '../../hooks/useSchedule.ts';
import {useGetUserInfo} from '../../hooks/useUser.ts';
import WeeklyCalendar from '../../components/Schedule/WeekCalendar.tsx';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {StudentInfoProps} from '../../types/user.ts';
import TimeTable from '../../components/Schedule/TimeTable.tsx';
import scheduleState from '../../recoil/Schedule';
import {GetScheduleProps} from '../../types/schedule.ts';

const Schedule = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  const userData = useRecoilValue(userState.userInfoState);
  // const dayScheduleData = useRecoilValue(scheduleState.dayScheduleState);
  const [isWeekend, setIsWeekend] = useState(false);
  const [selectDate, setSelectDate] = useState(moment());
  const [selectStudentInfo, setSelectStudentInfo] = useState<
    StudentInfoProps | undefined
  >(undefined);
  const [academyList, setAcademyList] = useState([{label: '', value: ''}]);
  const [selectAcademy, setSelectAcademy] = useState<number | undefined>(
    userData ? userData.studentList[0].academy.academyId : undefined,
  );

  const dayScheduleData = {
    scheduleList: [
      {
        scheduleId: 1,
        scheduleParentId: null,
        scheduleStartTime: '2024-01-18T17:04:00',
        scheduleMinutes: 60,
        lecture: {
          lectureId: 1,
          lectureName: 'Java 테스트',
          lectureAllowMinus: 5,
          lectureAllowPlus: 5,
          lectureAllowLatePlus: 0,
          lectureCheckInterval: 60,
        },
      },
      {
        scheduleId: 2,
        scheduleParentId: null,
        scheduleStartTime: '2024-01-18T18:05:00',
        scheduleMinutes: 60,
        lecture: {
          lectureId: 1,
          lectureName: 'Java 테스트',
          lectureAllowMinus: 5,
          lectureAllowPlus: 5,
          lectureAllowLatePlus: 0,
          lectureCheckInterval: 60,
        },
      },
      {
        scheduleId: 3,
        scheduleParentId: null,
        scheduleStartTime: '2024-01-18T17:04:00',
        scheduleMinutes: 60,
        lecture: {
          lectureId: 1,
          lectureName: 'Java 테스트',
          lectureAllowMinus: 5,
          lectureAllowPlus: 5,
          lectureAllowLatePlus: 0,
          lectureCheckInterval: 60,
        },
      },
      {
        scheduleId: 4,
        scheduleParentId: null,
        scheduleStartTime: '2024-01-18T17:04:00',
        scheduleMinutes: 60,
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
  const {
    mutateAsync: mutateGetWeekSchedule,
    data: weekData,
    status: weekDataStatus,
  } = useGetWeekSchedule();

  const onChangeDropList = (value: string) => {
    const studentInfo = userData?.studentList.filter(val => {
      return val.academy.academyId === Number(value);
    });
    setSelectStudentInfo(studentInfo);
    setSelectAcademy(Number(value));
  };

  const onChangeDate = (date: string) => {
    setSelectDate(moment(date));
  };

  const onChangeWeek = async (date: string) => {
    const args = {
      academyId: selectAcademy,
      date: date,
    };
    await mutateGetWeekSchedule(args);
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
              <Text>2024.01.01</Text>
            </>
          )}
          <View>
            {/*<Text>오늘/주간 설정</Text>*/}
            <Switch
              trackColor={{false: 'skyblue', true: 'gold'}}
              thumbColor={isWeekend ? 'gold' : 'skyblue'}
              ios_backgroundColor="white"
              onValueChange={toggleSwitch}
              value={isWeekend}
            />
          </View>
        </View>
        <Dropdown
          list={academyList}
          onChangeValue={onChangeDropList}
          disabled={userData ? userData.studentList.length <= 1 : false}
        />

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
      </View>
      {isWeekend ? (
        <View style={{height: '80%', paddingBottom: 120}}>
          <TimeTable weekData={weekData} onChangeWeek={onChangeWeek} />
        </View>
      ) : (
        <View>
          <WeeklyCalendar
            calendarType={isWeekend ? 'week' : 'day'}
            onChangeDate={onChangeDate}
          />
          <DayScheduleTable
            navigation={navigation}
            headers={['시간', '예정 강의']}
            scheduleData={dayScheduleData ?? {scheduleList: []}}
            studentInfo={selectStudentInfo}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Schedule;
