import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {useRecoilState} from 'recoil';

import CButton from '#components/common/CommonButton/CButton.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import ScheduleHeader from '#components/Schedule/ScheduleHeader.tsx';
import WeeklyCalendar from '#components/Schedule/WeeklyCalendar.tsx';
import Academy from '#containers/Academy';
import DaySchedules from '#containers/DailySchedules/components/DaySchedules.tsx';
import {useGetUserInfo} from '#hooks/useUser.ts';
import globalState from '#recoil/Global';
import {StudentInfoProps} from '#types/user.ts';

const DailySchedule = ({
  navigation,
}: {
  navigation: BottomTabNavigationHelpers;
}) => {
  const [selectAcademy, setSelectAcademy] = useRecoilState(
    globalState.selectedAcademy,
  );
  const [academyList, setAcademyList] = useState([{label: '', id: ''}]);
  const [selectStudentInfo, setSelectStudentInfo] = useState<
    StudentInfoProps | undefined
  >();

  const {userData} = useGetUserInfo();

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

  return (
    <>
      {userData &&
        (userData.studentList.length > 0 ? (
          <CSafeAreaView>
            <ScheduleHeader />
            <CView>
              {/*<Dropdown*/}
              {/*  items={academyList}*/}
              {/*  onSelect={onChangeDropList}*/}
              {/*  selected={*/}
              {/*    academyList.filter(val => val.id === String(selectAcademy))[0]*/}
              {/*  }*/}
              {/*  disabled={userData ? userData.studentList.length <= 0 : false}*/}
              {/*/>*/}
              <View style={styles.container}>
                <WeeklyCalendar />
                <DaySchedules />
                <CButton
                  text="사유서"
                  noMargin
                  onPress={() => {
                    navigation.navigate('ReasonStatement');
                  }}
                />
              </View>
            </CView>
          </CSafeAreaView>
        ) : (
          <Academy navigation={navigation} />
        ))}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 14,
  },
});
export default DailySchedule;
