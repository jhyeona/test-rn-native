import {useCallback} from 'react';
import {View} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import {useRecoilState, useRecoilValue} from 'recoil';

import DatePicker from '#components/common/Calendar/DatePicker.tsx';
import DaysLabel from '#containers/WeeklySchedules/components/DaysLabel.tsx';
import WeeklyGrid from '#containers/WeeklySchedules/components/WeeklyGrid.tsx';
import {useGetWeekSchedule} from '#containers/WeeklySchedules/hooks/useApi.ts';
import GlobalState from '#recoil/Global';
import scheduleState from '#recoil/Schedule';
import {weekOfMonth} from '#utils/scheduleHelper.ts';

const MONTH_FORMAT = 'YYYY년 MM월';

const SchedulesTable = () => {
  const selectAcademy = useRecoilValue(GlobalState.selectedAcademy); // 선택된 기관
  const [{date}, setSelectedDate] = useRecoilState(
    scheduleState.selectedCalendarDate,
  );

  useFocusEffect(
    useCallback(() => {
      setSelectedDate({isWeekly: true, date: moment()});
    }, [setSelectedDate]),
  );

  const {formattedData, timeLineData, refetchWeekSchedule} = useGetWeekSchedule(
    {
      academyId: selectAcademy,
      date: date.format('YYYYMMDD'),
    },
  );

  return (
    <>
      <DatePicker
        onDateChange={new Date(moment(date).format('YYYY-MM-DD'))}
        format={MONTH_FORMAT}
        dateText={weekOfMonth(date)}
        handleDateSelection={selectedDate => {
          setSelectedDate(prev => ({...prev, date: selectedDate}));
        }}
      />
      <View style={{flex: 1}}>
        <DaysLabel date={date} />
        <WeeklyGrid
          scheduleData={formattedData}
          timeLineData={timeLineData}
          refetch={refetchWeekSchedule}
        />
      </View>
    </>
  );
};

export default SchedulesTable;
