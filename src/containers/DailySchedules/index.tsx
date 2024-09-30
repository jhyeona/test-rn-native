import {useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {useSetRecoilState} from 'recoil';

import WeeklyCalendar from '#components/Calendar/WeeklyCalendar.tsx';
import CButton from '#components/common/CommonButton/CButton.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import AcademySelector from '#components/Schedule/AcademySelector.tsx';
import ScheduleHeader from '#components/Schedule/ScheduleHeader.tsx';
import Academy from '#containers/Academy';
import DaySchedules from '#containers/DailySchedules/components/DaySchedules.tsx';
import {useGetUserInfo} from '#hooks/useUser.ts';
import scheduleState from '#recoil/Schedule';
import {commonStyles} from '#utils/common.ts';

const DailySchedule = ({
  navigation,
}: {
  navigation: BottomTabNavigationHelpers;
}) => {
  const {userData} = useGetUserInfo();
  const navigate = useNavigation();

  const setSelectedDate = useSetRecoilState(scheduleState.selectedCalendarDate);

  useEffect(() => {
    // 기관이 없을 경우 기관 설정 페이지에서는 하단 네비게이션 숨김
    if (userData) {
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
            <CView>
              <AcademySelector />
              <View style={styles.container}>
                <WeeklyCalendar />
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
