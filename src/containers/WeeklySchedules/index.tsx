import {useCallback, useEffect} from 'react';

import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment/moment';
import {useSetRecoilState} from 'recoil';

import TimeTable from '#components/Calendar/TimeTable.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import AcademySelector from '#components/Schedule/AcademySelector.tsx';
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
        <AcademySelector />
        <TimeTable />
      </CView>
    </CSafeAreaView>
  );
};

export default WeeklySchedules;
