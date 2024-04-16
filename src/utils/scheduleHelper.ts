import moment, {Moment} from 'moment/moment';
import {ScheduleHistoryDataProps} from '#types/schedule.ts';

export const weekOfMonth = (nowDate: Moment) => {
  const weekOfMonthNumber = (date: Moment) =>
    date.week() - moment(date).startOf('month').week() + 1;

  return `${nowDate.format('YYYY.MM')} ${weekOfMonthNumber(nowDate)}주`;
};

export const convertTimeFormat = (timeString: string) => {
  const date = moment(timeString);
  const hours = date.hours();
  const minutes = date.minutes();

  let convertedTime = hours + minutes / 60;
  return Number(convertedTime.toFixed(1));
};

export const isBetween = (startTime: Moment, endTime: Moment) => {
  return moment().isBetween(startTime, endTime, undefined, '[]');
};

export const handleErrorResponse = (code: string) => {
  switch (code) {
    case '1004':
      return '요청 순서가 유효하지 않습니다.';
    case '1005':
      return '출석 인정 시간이 아닙니다.';
    case '1006':
      return '해당 강의는 주기적으로 확인하는 강의가 아닙니다.';
    case '4061':
      return '위치 정보가 올바르지 않습니다.';
    default:
      return '처리되지 않았습니다.';
  }
};

export const attendList = (historyData: ScheduleHistoryDataProps) => {
  const timeList = historyData.scheduleTimeList;
  const attendTrueList = historyData.scheduleTimeList
    .filter(val => {
      return val.check;
    })
    .map(item => ({...item}));

  const intervalEventList = historyData.intervalEventList?.map(item => ({
    ...item,
  })); // map 을 사용하여 깊은 복사

  return timeList.map(item => {
    if (item.check) {
      const matchedTime = attendTrueList.shift(); // 시간별 체크 리스트
      const matchedEvent = intervalEventList?.shift(); // 시간별 체크의 이벤트 리스트
      return {
        ...item,
        ...(matchedTime && {check: matchedTime.check}),
        ...(matchedEvent?.eventType && {eventType: matchedEvent.eventType}),
      };
    } else {
      return item;
    }
  });
};
