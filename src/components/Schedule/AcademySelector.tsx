import {useEffect, useState} from 'react';

import {useRecoilState} from 'recoil';

import Dropdown, {ItemProps} from '#components/common/Dropdown/Dropdown.tsx';
import {useGetUserInfo} from '#hooks/useUser.ts';
import GlobalState from '#recoil/Global';

const AcademySelector = () => {
  const [academyList, setAcademyList] = useState([{label: '', id: ''}]);
  const [selectAcademy, setSelectAcademy] = useRecoilState(
    GlobalState.selectedAcademy,
  );

  const {userData} = useGetUserInfo();

  useEffect(() => {
    if (userData && userData.studentList.length > 0) {
      const newList: Array<ItemProps> = [];
      userData?.studentList.map(val => {
        newList.push({
          label: val.academy.name,
          id: String(val.academy.academyId),
        });
      });
      setAcademyList(newList); // 기관 선택 리스트
      setSelectAcademy(newList[0].id); // 기관의 기본 선택 데이터는 첫번째 기관
    }
  }, [userData]);

  return (
    <Dropdown
      items={academyList}
      onSelect={item => setSelectAcademy(item.id)}
      selected={academyList.filter(val => val.id === String(selectAcademy))[0]}
      disabled={userData ? userData.studentList.length <= 0 : false}
    />
  );
};

export default AcademySelector;
