import React, {useEffect, useMemo, useRef, useState} from 'react';
import moment from 'moment/moment';
import {
  EventItem,
  TimelineCalendar,
  TimelineCalendarHandle,
} from '@howljs/calendar-kit';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import scheduleState from '#recoil/Schedule';
import {View} from 'react-native';
import globalState from '#recoil/Global';
import {convertTimeFormat} from '#utils/scheduleHelper.ts';
import {useChangeWidth} from '#hooks/useGlobal.ts';
import {timeTableTheme} from '#constants/calendar.ts';

const TimeTable = () => {
  const weekData = useRecoilValue(scheduleState.weekScheduleState);
  const selectWeekDate = useRecoilValue(globalState.selectWeekScheduleDate);
  const setSelectWeekDate = useSetRecoilState(
    globalState.selectWeekScheduleDate,
  );

  const [isInitRendering, setIsInitRendering] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(24.5);

  const calendarRef = useRef<TimelineCalendarHandle>(null);
  const changeWidth = useChangeWidth();
  const theme = useMemo(() => timeTableTheme, []);

  const formattedData = () => {
    const formatted: EventItem[] = [];
    console.log(weekData?.scheduleList.length);
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

  const onChangeDate = (date: string) => {
    const numOfDays = 7;
    const fromDate = new Date(date);
    const toDate = new Date(date);
    toDate.setDate(toDate.getDate() + numOfDays);
    setSelectWeekDate(moment(fromDate).format('YYYYMMDD'));
  };

  useEffect(() => {
    if (weekData && weekData?.scheduleList.length > 0) {
      const start = convertTimeFormat(
        weekData.scheduleList[0].scheduleStartTime,
      );
      setStartTime(start < 1 ? 0 : Math.floor(start - 0.5));
      return;
    }
    setStartTime(0);
  }, [weekData]);

  useEffect(() => {
    setSelectWeekDate(moment().format('YYYY-MM-DD'));
  }, [setSelectWeekDate]);

  useEffect(() => {
    // 가로 사이즈가 변하면 (ex. galaxy fold) 화면 재렌더링 // 추후 변경 예정
    setIsInitRendering(false);
    setTimeout(() => {
      setIsInitRendering(true);
      // calendarRef.current?.goToHour(moment().hour());
    }, 200);
  }, [changeWidth]);

  return (
    <View style={{flexGrow: 1, paddingTop: 4}}>
      {isInitRendering && (
        <TimelineCalendar
          ref={calendarRef}
          initialDate={moment(selectWeekDate).format('YYYY-MM-DD')}
          calendarWidth={changeWidth}
          viewMode="week"
          events={formattedData()}
          onDateChanged={onChangeDate}
          locale="ko"
          start={startTime} // time 시작 시간
          end={endTime} // time 종료 시간
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
    </View>
  );
};

export default TimeTable;
