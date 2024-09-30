import {useCallback} from 'react';

import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment/moment';
import {useSetRecoilState} from 'recoil';

import TimeTable from '#components/Calendar/TimeTable.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import ScheduleHeader from '#components/Schedule/ScheduleHeader.tsx';
import scheduleState from '#recoil/Schedule';
import CText from '#components/common/CustomText/CText.tsx';

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
        <CText text="TODO: new timeline table" />
      </CView>
    </CSafeAreaView>
  );
};

export default WeeklySchedules;
