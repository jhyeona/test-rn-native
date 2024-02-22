import React, {useEffect, useState} from 'react';
import moment from 'moment';
import 'moment/locale/ko';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import userState from '../../recoil/user';
import {
  useGetDaySchedule,
  useGetWeekSchedule,
} from '../../hooks/useSchedule.ts';
import {useGetUserInfo} from '../../hooks/useUser.ts';
import DayCalendar from '../../components/Schedule/DayCalendar.tsx';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {StudentInfoProps} from '../../types/user.ts';
import TimeTable from '../../components/Schedule/TimeTable.tsx';
import CSafeAreaView from '../../components/common/CommonView/CSafeAreaView.tsx';
import CView from '../../components/common/CommonView/CView.tsx';
import ScheduleHeader from '../../components/Schedule/ScheduleHeader.tsx';
import Dropdown from '../../components/common/Dropdown/Dropdown.tsx';
import CButton from '../../components/common/CommonButton/CButton.tsx';
import globalState from '../../recoil/Global';
import {View} from 'react-native';
import Academy from '../Academy';

const Schedule = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  const userData = useRecoilValue(userState.userInfoState);
  // const selectDayDate = useRecoilValue(globalState.selectDayScheduleDate);
  // const selectWeekDate = useRecoilValue(globalState.selectWeekScheduleDate);

  const [selectDayDate, setSelectDayDate] = useRecoilState(
    globalState.selectDayScheduleDate,
  );
  const [selectWeekDate, setSelectWeekDate] = useRecoilState(
    globalState.selectWeekScheduleDate,
  );
  const [selectAcademy, setSelectAcademy] = useRecoilState(
    globalState.selectedAcademy,
  );
  const [isWeekend, setIsWeekend] = useState(false);
  const [selectStudentInfo, setSelectStudentInfo] = useState<
    StudentInfoProps | undefined
  >(undefined);
  const [academyList, setAcademyList] = useState([{label: '', id: ''}]);

  useGetUserInfo(); //유저 정보
  useGetDaySchedule({
    // 일일 데이터
    academyId: selectAcademy,
    date: moment(selectDayDate).format('YYYYMMDD'),
  });
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
    const studentInfo = selectedStudentInfo(item.id);
    setSelectStudentInfo(studentInfo && studentInfo[0]);
    setSelectAcademy(Number(item.id));
  };

  const selectedStudentInfo = (id: string) => {
    // 선택된 기관의 학생(또는 강사)의 정보
    return userData?.studentList.filter(val => {
      if (id) {
        return val.academy.academyId === Number(id);
      }
      return userData.studentList[0];
    });
  };

  const onPressHistory = () => {
    // 내 출석 기록 보기 페이지로 이동
    navigation.navigate('ScheduleHistory');
  };

  useEffect(() => {
    if (userData && userData.studentList.length > 0) {
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

  useEffect(() => {
    const studentInfo = selectedStudentInfo(academyList[0].id); // 처음 선택된 기관의 유저 정보
    setSelectStudentInfo(studentInfo && studentInfo[0]);
  }, [academyList]);

  useEffect(() => {
    setSelectDayDate(moment().format('YYYY-MM-DD'));
    setSelectWeekDate(moment().format('YYYY-MM-DD'));
  }, [isWeekend, setSelectDayDate, setSelectWeekDate]);

  return (
    <>
      {userData &&
        (userData.studentList.length > 0 ? (
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
                  <TimeTable />
                </View>
              ) : (
                selectStudentInfo && (
                  <>
                    <DayCalendar
                      studentInfo={selectStudentInfo}
                      navigation={navigation}
                    />
                    <CButton
                      text="내 출석 기록 보기"
                      onPress={onPressHistory}
                      buttonStyle={{marginBottom: 10}}
                      noMargin
                    />
                  </>
                )
              )}
            </CView>
          </CSafeAreaView>
        ) : (
          <Academy navigation={navigation} />
        ))}
    </>
  );
};

export default Schedule;
