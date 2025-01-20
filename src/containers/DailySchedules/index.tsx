import {useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {useRecoilState, useSetRecoilState} from 'recoil';

import DatePicker from '#components/common/Calendar/DatePicker.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import ScheduleHeader from '#components/Schedule/ScheduleHeader.tsx';
import {ACCESS_TOKEN, DATE_FORMAT_DASH} from '#constants/common.ts';
import Academy from '#containers/Academy';
import BtnReasonList from '#containers/DailySchedules/components/BtnReasonList.tsx';
import DaySchedules from '#containers/DailySchedules/components/DaySchedules.tsx';
import {getUniqueAcademyList} from '#containers/SelectAcademy/services/AcademyListHelper.ts';
import {useGetUserInfo} from '#hooks/useUser.ts';
import GlobalState from '#recoil/Global';
import scheduleState from '#recoil/Schedule';
import {commonStyles} from '#utils/common.ts';
import {getStorageItem} from '#utils/storageHelper.ts';

const DATE_VIEW_FORMAT = 'YYYY년 MM월 DD일 (dd)';

const DailySchedule = ({navigation}: {navigation: BottomTabNavigationHelpers}) => {
  const {userData} = useGetUserInfo();
  const navigate = useNavigation();

  const setIsLogin = useSetRecoilState(GlobalState.isLoginState);
  const setSelectAcademy = useSetRecoilState(GlobalState.selectedAcademy);
  const [{date}, setSelectedDate] = useRecoilState(scheduleState.selectedCalendarDate);

  useEffect(() => {
    if (userData) {
      // 토큰 확인
      if (!getStorageItem(ACCESS_TOKEN)) {
        setIsLogin(false);
        return;
      }

      const isAcademyList = userData.studentList.length;
      if (isAcademyList) {
        const newList = getUniqueAcademyList(userData);
        setSelectAcademy(getStorageItem('academy') ?? newList[0].id); // 기관의 기본 선택 데이터는 첫번째 기관
      }

      // 기관이 없을 경우 기관 설정 페이지에서는 하단 네비게이션 숨김
      navigate.setOptions({
        tabBarStyle: [{display: isAcademyList ? 'flex' : 'none'}, commonStyles.tabBarStyle],
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
                onDateChange={new Date(moment(date).format(DATE_FORMAT_DASH))}
                format={DATE_VIEW_FORMAT}
                handleDateSelection={selectedDate => {
                  setSelectedDate(prev => ({...prev, date: selectedDate}));
                }}
                todayDot
              />
              <View style={styles.container}>
                <DaySchedules />
              </View>
            </CView>
            <BtnReasonList navigation={navigation} />
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
    marginBottom: 10,
  },
});
export default DailySchedule;
