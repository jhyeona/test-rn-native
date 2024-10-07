import {useCallback} from 'react';
import {View} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment/moment';
import {useSetRecoilState} from 'recoil';

import TimeTable from '#components/Calendar/TimeTable.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import ScheduleHeader from '#components/Schedule/ScheduleHeader.tsx';
import scheduleState from '#recoil/Schedule';

const WeeklySchedules = () => {
  const setSelectedDate = useSetRecoilState(scheduleState.selectedCalendarDate);

  useFocusEffect(
    useCallback(() => {
      setSelectedDate({isWeekly: true, date: moment()});
    }, [setSelectedDate]),
  );

  return (
    <CSafeAreaView>
      <ScheduleHeader />
      <CView>
        {/*<AcademySelector />*/}
        {/*<TimeTable />*/}
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <CText text="🐣 오픈 예정 입니다." fontSize={20} />
        </View>
      </CView>
    </CSafeAreaView>
  );
};

export default WeeklySchedules;
