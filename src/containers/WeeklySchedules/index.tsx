import {useCallback} from 'react';
import {View} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment/moment';
import {useRecoilState} from 'recoil';

import DatePicker from '#components/common/Calendar/DatePicker.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import ScheduleHeader from '#components/Schedule/ScheduleHeader.tsx';
import {DATE_FORMAT_DASH} from '#constants/common.ts';
import WeeklyGrid from '#containers/WeeklySchedules/components/WeeklyGrid.tsx';
import scheduleState from '#recoil/Schedule';
import {weekOfMonth} from '#utils/scheduleHelper.ts';

const MONTH_FORMAT = 'YYYY년 MM월';

const WeeklySchedules = () => {
  const [{date}, setSelectedDate] = useRecoilState(scheduleState.selectedCalendarDate);

  useFocusEffect(
    useCallback(() => {
      setSelectedDate({isWeekly: true, date: moment()});
    }, [setSelectedDate]),
  );

  return (
    <CSafeAreaView>
      <ScheduleHeader />
      <CView style={{display: 'flex', gap: 12}}>
        <DatePicker
          onDateChange={new Date(moment(date).format(DATE_FORMAT_DASH))}
          format={MONTH_FORMAT}
          dateText={weekOfMonth(date)}
          handleDateSelection={selectedDate => {
            setSelectedDate(prev => ({...prev, date: selectedDate}));
          }}
        />
        <View style={{flex: 1}}>
          <WeeklyGrid date={date} />
        </View>
      </CView>
    </CSafeAreaView>
  );
};

export default WeeklySchedules;
