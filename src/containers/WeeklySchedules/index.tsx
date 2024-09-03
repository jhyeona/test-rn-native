import React, {useEffect, useState} from 'react';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import moment from 'moment/moment';
import {useRecoilState, useRecoilValue} from 'recoil';

import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import Dropdown from '#components/common/Dropdown/Dropdown.tsx';
import Header from '#components/common/Header/Header.tsx';
import TimeTable from '#components/Schedule/TimeTable.tsx';
import {useGetWeekSchedule} from '#hooks/useSchedule.ts';
import globalState from '#recoil/Global';
import userState from '#recoil/User';

const WeeklySchedules = ({
  navigation,
}: {
  navigation: BottomTabNavigationHelpers;
}) => {
  const userData = useRecoilValue(userState.userInfoState);
  const [academyList, setAcademyList] = useState([{label: '', id: ''}]);
  const [selectAcademy, setSelectAcademy] = useRecoilState(
    globalState.selectedAcademy,
  );

  const [selectWeekDate, setSelectWeekDate] = useRecoilState(
    globalState.selectWeekScheduleDate,
  );
  useGetWeekSchedule({
    // 주간 데이터
    academyId: selectAcademy,
    date: moment(selectWeekDate).format('YYYYMMDD'),
  });
  const onChangeDropList = (item: {label: string; id: string}) => {
    setSelectAcademy(Number(item.id));
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
    setSelectWeekDate(moment().format('YYYY-MM-DD'));
  }, [setSelectWeekDate]);

  return (
    <CSafeAreaView>
      <Header title="주간 일정" navigation={navigation} />
      <CView>
        <Dropdown
          items={academyList}
          onSelect={onChangeDropList}
          selected={
            academyList.filter(val => val.id === String(selectAcademy))[0]
          }
          disabled={userData ? userData.studentList.length <= 0 : false}
        />
        <TimeTable />
      </CView>
    </CSafeAreaView>
  );
};

export default WeeklySchedules;
