import {StyleSheet, View} from 'react-native';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

import WeeklyCalendar from '#components/Calendar/WeeklyCalendar.tsx';
import CButton from '#components/common/CommonButton/CButton.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import AcademySelector from '#components/Schedule/AcademySelector.tsx';
import ScheduleHeader from '#components/Schedule/ScheduleHeader.tsx';
import Academy from '#containers/Academy';
import DaySchedules from '#containers/DailySchedules/components/DaySchedules.tsx';
import {useGetUserInfo} from '#hooks/useUser.ts';

const DailySchedule = ({
  navigation,
}: {
  navigation: BottomTabNavigationHelpers;
}) => {
  const {userData} = useGetUserInfo();

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
