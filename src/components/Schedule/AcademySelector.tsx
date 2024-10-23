import {useEffect, useState} from 'react';
import {Alert} from 'react-native';

import {useRecoilState} from 'recoil';

import Dropdown, {ItemProps} from '#components/common/Dropdown/Dropdown.tsx';
import {getUniqueAcademyList} from '#containers/SelectAcademy/services/AcademyListHelper.ts';
import {useGetUserInfo} from '#hooks/useUser.ts';
import GlobalState from '#recoil/Global';

const AcademySelector = () => {
  const {userData} = useGetUserInfo();
  const [selectAcademy, setSelectAcademy] = useRecoilState(
    GlobalState.selectedAcademy,
  );

  const [academyList, setAcademyList] = useState([{label: '', id: ''}]);

  const onSelectAcademy = (item: ItemProps) => {
    Alert.alert(`${item.label} 기관이 선택되었습니다.`);
    setSelectAcademy(item.id);
  };

  useEffect(() => {
    if (userData) {
      const newList = getUniqueAcademyList(userData);

      // 변경된 경우에만 업데이트
      const isListChanged =
        newList.length !== academyList.length ||
        newList.some((item, index) => item.id !== academyList[index]?.id);
      if (isListChanged) {
        setAcademyList(newList);
      }

      // 기본 선택이 없는 경우 첫 번째 기관 선택
      if (!selectAcademy) {
        setSelectAcademy(newList[0].id);
      }
    }
  }, [userData]);

  return (
    <Dropdown
      items={academyList}
      onSelect={onSelectAcademy}
      selected={academyList.filter(val => val.id === String(selectAcademy))[0]}
      disabled={userData ? userData.studentList.length <= 0 : false}
    />
  );
};

export default AcademySelector;
