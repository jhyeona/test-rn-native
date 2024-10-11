import {useCallback, useEffect} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {useRecoilState, useSetRecoilState} from 'recoil';

import DraggableFAB from '#components/common/Animation/Floator.tsx';
import DatePicker from '#components/common/Calendar/DatePicker.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import {ItemProps} from '#components/common/Dropdown/Dropdown.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import ScheduleHeader from '#components/Schedule/ScheduleHeader.tsx';
import {BOX_SHADOW, COLORS} from '#constants/colors.ts';
import {ACCESS_TOKEN} from '#constants/common.ts';
import Academy from '#containers/Academy';
import DaySchedules from '#containers/DailySchedules/components/DaySchedules.tsx';
import {useGetUserInfo} from '#hooks/useUser.ts';
import GlobalState from '#recoil/Global';
import scheduleState from '#recoil/Schedule';
import {commonStyles} from '#utils/common.ts';
import {getItem} from '#utils/storageHelper.ts';

const DATE_FORMAT = 'YYYY년 MM월 DD일 (dd)';

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
                format={DATE_FORMAT}
                handleDateSelection={selectedDate => {
                  setSelectedDate(prev => ({...prev, date: selectedDate}));
                }}
              />
              {/*<AcademySelector />*/}
              <View style={styles.container}>
                <DaySchedules />
              </View>
            </CView>
            <DraggableFAB>
              <Pressable
                onPress={() => {
                  navigation.navigate('ReasonStatement');
                }}
                style={styles.btnReason}>
                <SvgIcon name="Notepad" />
                <CText text="사유서" color={COLORS.lightGray} />
              </Pressable>
            </DraggableFAB>
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
  btnReason: {
    gap: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 48,
    backgroundColor: COLORS.primary,
    ...BOX_SHADOW,
  },
});
export default DailySchedule;
