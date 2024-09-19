import React, {useEffect, useState} from 'react';

import {useRecoilState, useRecoilValue} from 'recoil';

import TimeTable from '#components/Calendar/TimeTable.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import Dropdown from '#components/common/Dropdown/Dropdown.tsx';
import ScheduleHeader from '#components/Schedule/ScheduleHeader.tsx';
import GlobalState from '#recoil/Global';
import userState from '#recoil/User';

const WeeklySchedules = () => {
  const userData = useRecoilValue(userState.userInfoState);
  const [academyList, setAcademyList] = useState([{label: '', id: ''}]);
  const [selectAcademy, setSelectAcademy] = useRecoilState(
    GlobalState.selectedAcademy,
  );

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

  return (
    <CSafeAreaView>
      <ScheduleHeader />
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
