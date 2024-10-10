import {useCallback} from 'react';

import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment/moment';
import {useSetRecoilState} from 'recoil';

import DatePicker from '#components/common/Calendar/DatePicker.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
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
        <DatePicker format="YYYY년 MM월 DD일 (dd)" />
      </CView>
    </CSafeAreaView>
  );
};

export default WeeklySchedules;
