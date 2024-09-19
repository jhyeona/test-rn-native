import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {useRecoilState} from 'recoil';

import WeeklyCalendar from '#components/Calendar/WeeklyCalendar.tsx';
import CButton from '#components/common/CommonButton/CButton.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import Dropdown, {ItemProps} from '#components/common/Dropdown/Dropdown.tsx';
import ScheduleHeader from '#components/Schedule/ScheduleHeader.tsx';
import Academy from '#containers/Academy';
import DaySchedules from '#containers/DailySchedules/components/DaySchedules.tsx';
import {useGetUserInfo} from '#hooks/useUser.ts';
import GlobalState from '#recoil/Global';

const DailySchedule = ({
  navigation,
}: {
  navigation: BottomTabNavigationHelpers;
}) => {
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
    <>
      {userData &&
        (userData.studentList.length > 0 ? (
          <CSafeAreaView>
            <ScheduleHeader />
            <CView>
              <Dropdown
                items={academyList}
                onSelect={item => setSelectAcademy(item.id)}
                selected={
                  academyList.filter(val => val.id === String(selectAcademy))[0]
                }
                disabled={userData ? userData.studentList.length <= 0 : false}
              />
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
