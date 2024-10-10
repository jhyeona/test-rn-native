import {useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {useRecoilState, useSetRecoilState} from 'recoil';

import DatePicker from '#components/common/Calendar/DatePicker.tsx';
import CButton from '#components/common/CommonButton/CButton.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import {ItemProps} from '#components/common/Dropdown/Dropdown.tsx';
import AcademySelector from '#components/Schedule/AcademySelector.tsx';
import ScheduleHeader from '#components/Schedule/ScheduleHeader.tsx';
import {ACCESS_TOKEN} from '#constants/common.ts';
import Academy from '#containers/Academy';
import DaySchedules from '#containers/DailySchedules/components/DaySchedules.tsx';
import {useGetUserInfo} from '#hooks/useUser.ts';
import GlobalState from '#recoil/Global';
import scheduleState from '#recoil/Schedule';
import {commonStyles} from '#utils/common.ts';
import {getItem} from '#utils/storageHelper.ts';

const DailySchedule = ({
  navigation,
}: {
  navigation: BottomTabNavigationHelpers;
}) => {
  const {userData} = useGetUserInfo();
  const navigate = useNavigation();

  const setIsLogin = useSetRecoilState(GlobalState.isLoginState);
  const setSelectAcademy = useSetRecoilState(GlobalState.selectedAcademy);
  const [{date}, setSelectedDate] = useRecoilState(
    scheduleState.selectedCalendarDate,
  );

  useEffect(() => {
    if (userData) {
      const token = getItem(ACCESS_TOKEN);
      if (!token) {
        setIsLogin(false);
        return;
      }

      if (userData.studentList.length > 0) {
        const newList: Array<ItemProps> = [];
        userData?.studentList.map(val => {
          newList.push({
            label: val.academy.name,
            id: String(val.academy.academyId),
          });
        });
        setSelectAcademy(newList[0].id); // 기관의 기본 선택 데이터는 첫번째 기관
      }
      // 기관이 없을 경우 기관 설정 페이지에서는 하단 네비게이션 숨김
      navigate.setOptions({
        tabBarStyle: [
          {
            display: userData.studentList.length > 0 ? 'flex' : 'none',
          },
          commonStyles.tabBarStyle,
        ],
      });
    }
  }, [navigate, userData]);

  useFocusEffect(
    useCallback(() => {
      setSelectedDate({isWeekly: false, date: moment()});
    }, [setSelectedDate]),
  );

  return (
    <>
      {userData &&
        (userData.studentList.length > 0 ? (
          <CSafeAreaView>
            <ScheduleHeader />
            <CView style={{display: 'flex', gap: 12}}>
              <DatePicker
                onDateChange={new Date(moment(date).format('YYYY-MM-DD'))}
                format="YYYY년 MM월 DD일 (dd)"
                handleDateSelection={selectedDate => {
                  setSelectedDate(prev => ({...prev, date: selectedDate}));
                }}
              />
              {/*<AcademySelector />*/}
              <View style={styles.container}>
                {/*<WeeklyCalendar />*/}
                <DaySchedules />
                <CButton
                  text="사유서 목록"
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
  },
});
export default DailySchedule;
