import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  EventItem,
  HighlightDates,
  MomentConfig,
  TimelineCalendar,
  TimelineCalendarHandle,
} from '@howljs/calendar-kit';
import moment from 'moment/moment';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import scheduleState from '../../recoil/Schedule';
import {Dimensions} from 'react-native';
import {COLORS} from '../../constants/colors';
import globalState from '../../recoil/Global';

const TimeTable = () => {
  const calendarWidth = Dimensions.get('window').width - 48; // 기본 padding 24X2 뺀 값
  const weekData = useRecoilValue(scheduleState.weekScheduleState);
  const selectWeekDate = useRecoilValue(globalState.selectWeekScheduleDate);
  const setSelectWeekDate = useSetRecoilState(
    globalState.selectWeekScheduleDate,
  );
  const setIsLoading = useSetRecoilState(globalState.globalLoadingState);
  const [isInitRendering, setIsInitRendering] = useState(false);
  const calendarRef = useRef<TimelineCalendarHandle>(null);

  const formattedData = () => {
    const formatted: EventItem[] = [];
    weekData?.scheduleList &&
      weekData.scheduleList.map((info, i) => {
        formatted.push({
          id: i.toString(),
          title: info.lecture.lectureName,
          start: moment(info.scheduleStartTime).toISOString(),
          end: moment(info.scheduleEndTime).toISOString(),
          containerStyle: {
            borderRadius: 0,
            backgroundColor: '#E5F3FF',
          },
        });
      });
    return formatted;
  };

  MomentConfig.updateLocale('ko', {
    weekdaysShort: '일_월_화_수_목_금_토'.split('_'),
  });

  const onChangeWeek = async (date: string) => {
    // 주간 날짜
    setSelectWeekDate(date);
  };

  const _onDateChanged = async (date: string) => {
    const numOfDays = 7;
    const fromDate = new Date(date);
    const toDate = new Date(date);
    toDate.setDate(toDate.getDate() + numOfDays);
    await onChangeWeek(moment(fromDate).format('YYYYMMDD'));
  };

  const highlightDates: HighlightDates = useMemo(
    // 공휴일 색 표시할 때 사용
    () => ({
      // '2024-02-09': {
      //   dayNameColor: 'red',
      //   dayNumberColor: 'red',
      //   dayNumberBackgroundColor: '#FFF',
      // },
    }),
    [],
  );

  const theme = useMemo(
    () => ({
      cellBorderColor: COLORS.layout,

      //event title
      eventTitle: {color: COLORS.dark.blue, fontSize: 11},

      //Saturday style
      saturdayName: {color: 'black'},
      saturdayNumber: {color: 'black'},
      // saturdayNumberContainer: {backgroundColor: 'white'},

      //Sunday style
      sundayName: {color: 'black'},
      sundayNumber: {color: 'black'},
      // sundayNumberContainer: {backgroundColor: 'white'},

      //Today style
      todayName: {color: 'white'},
      todayNumber: {color: 'white'},
      todayNumberContainer: {backgroundColor: COLORS.primary},

      //Normal style
      dayName: {color: 'black'},
      dayNumber: {color: 'black'},
      dayNumberContainer: {backgroundColor: 'white'},

      //Loading style
      loadingBarColor: COLORS.primary,
    }),
    [],
  );

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsInitRendering(true);
      setIsLoading(false);
      calendarRef.current?.goToHour(moment().hour());
    }, 200);
  }, []);

  return (
    <>
      {isInitRendering && (
        <TimelineCalendar
          ref={calendarRef}
          initialDate={moment(selectWeekDate).format('YYYY-MM-DD')}
          calendarWidth={calendarWidth}
          viewMode="week"
          events={formattedData()}
          highlightDates={highlightDates}
          onDateChanged={_onDateChanged}
          locale="ko"
          start={0} // time 시작 시간
          end={24.5} // time 종료 시간
          firstDay={1} // 1: 월요일
          theme={theme}
          showNowIndicator
          isShowHalfLine={false}
          timeInterval={30}
          initialTimeIntervalHeight={27}
          allowPinchToZoom // 줌 확대 가능 여부
          // maxDate={moment().add(1, 'week').isoWeekday(0).format('YYYY-MM-DD')} // 다음주 일요일이 마지막
          // isLoading={isLoading}
          // minTimeIntervalHeight={29}
          // maxTimeIntervalHeight={110}
        />
      )}
    </>
  );
};

export default TimeTable;
