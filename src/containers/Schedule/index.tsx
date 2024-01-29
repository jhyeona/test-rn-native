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
import {useRecoilState, useRecoilValue} from 'recoil';
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
import CSafeAreaView from '../../components/common/CommonView/CSafeAreaView.tsx';
import CView from '../../components/common/CommonView/CView.tsx';
import ScheduleHeader from '../../components/Schedule/ScheduleHeader.tsx';
import Dropdown from '../../components/common/Dropdown/Dropdown.tsx';
import CButton from '../../components/common/CommonButton/CButton.tsx';
import globalState from '../../recoil/Global';
import {selectWeekScheduleDate} from '../../recoil/Global/atom.ts';

const Schedule = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  const userData = useRecoilValue(userState.userInfoState);
  const dayScheduleData = useRecoilValue(scheduleState.dayScheduleState);
  const [selectDayDate, setSelectDayDate] = useRecoilState(
    globalState.selectDayScheduleDate,
  );
  const [selectWeekDate, setSelectWeekDate] = useRecoilState(
    globalState.selectWeekScheduleDate,
  );
  const [isWeekend, setIsWeekend] = useState(false);
  // const [selectDate, setSelectDate] = useState(moment());
  const [selectStudentInfo, setSelectStudentInfo] = useState<
    StudentInfoProps | undefined
  >(undefined);
  const [academyList, setAcademyList] = useState([{label: '', id: ''}]);
  const [selectAcademy, setSelectAcademy] = useState<number | undefined>(
    userData ? userData.studentList[0].academy.academyId : undefined,
  );

  useGetUserInfo(); //유저 정보
  // useGetDaySchedule({
  //   // 일일 데이터
  //   academyId: selectAcademy,
  //   date: moment(selectDayDate).format('YYYYMMDD'),
  // });
  //
  useGetWeekSchedule({
    // 주간 데이터
    academyId: selectAcademy,
    date: moment(selectWeekDate).format('YYYYMMDD'),
  });

  const handleToggle = (value: boolean) => {
    // 오늘 / 주간 토글 변경
    setIsWeekend(value);
  };

  const onChangeDropList = (item: {label: string; id: string}) => {
    // 기관 변경
    const studentInfo = userData?.studentList.filter(val => {
      return val.academy.academyId === Number(item.id);
    });
    setSelectStudentInfo(studentInfo && studentInfo[0]);
    setSelectAcademy(Number(item.id));
  };

  const onChangeDate = (date: string) => {
    // 일일 데이터 - 날짜 선택
    setSelectDayDate(date);
  };

  const onChangeWeek = async (date: string) => {
    // 주간 날짜
    setSelectWeekDate(date);
  };

  const onPressHistory = () => {
    // 내 출석 기록 보기 페이지로 이동
    navigation.navigate('ScheduleHistory');
  };

  useEffect(() => {
    if (userData) {
      const newList: Array<{label: string; id: string}> = [];
      userData?.studentList.map(val => {
        newList.push({
          label: val.academy.name,
          id: String(val.academy.academyId),
        });
      });
      setAcademyList(newList); // 기관 선택 리스트
      setSelectAcademy(Number(newList[0].id)); // 기관의 기본 선택 데이터는 첫번째 기관
    }
  }, [userData]);

  return (
    <CSafeAreaView>
      <ScheduleHeader isWeekend={isWeekend} setIsWeekend={handleToggle} />
      <CView>
        <Dropdown
          items={academyList}
          onSelect={onChangeDropList}
          selected={
            academyList.filter(val => val.id === String(selectAcademy))[0]
          }
          disabled={userData ? userData.studentList.length <= 1 : false}
        />
        {isWeekend ? (
          <View style={{flexGrow: 1, paddingTop: 4}}>
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
            <CButton
              text="내 출석 기록 보기"
              onPress={onPressHistory}
              noMargin
            />
          </>
        )}
      </CView>

      {/*<Pressable*/}
      {/*  onPress={onPressHistory}*/}
      {/*  style={{*/}
      {/*    backgroundColor: 'lightgrey',*/}
      {/*    alignItems: 'center',*/}
      {/*    margin: 10,*/}
      {/*    padding: 10,*/}
      {/*  }}>*/}
      {/*  <Text>내 출석 기록 보기</Text>*/}
      {/*</Pressable>*/}
    </CSafeAreaView>
  );
};

export default Schedule;
