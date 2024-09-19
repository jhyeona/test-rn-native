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

// 1. EXPIRED_ACADEMY("4035", "사용 계약 일자가 만료된 기관입니다! 해당 기관에 문의해주세요.", HttpStatus.FORBIDDEN),
// 2. LESS_INFO_FOR_EVENT("4016", "출석에 필요한 정보가 부족합니다!", HttpStatus.BAD_REQUEST),
// 3. NO_MATCH_DEVICE_ATTENDEE("4034", "기존에 출석한 기기와 다른 기기입니다! 출석하려면 해당 기관에 문의해주세요.", HttpStatus.FORBIDDEN),
// 4. INVALID_PLACE("4061", "강의에 입력된 위치 인증 장치 정보에 부합하지 않음.", HttpStatus.NOT_ACCEPTABLE),
// 5. NOT_ALLOWED_TIME("1005", "해당 스케줄의 이벤트 허용시간이 아닙니다!", HttpStatus.BAD_REQUEST),
// 6. INVALID_EVENT_SEQUENCE("1004", "유효하지 않은 순서로 이벤트를 요청했습니다.", HttpStatus.BAD_REQUEST),
export const handleErrorResponse = (code: string) => {
  switch (code) {
    case '1004':
      return '출석 순서가 유효하지 않습니다.';
    case '1005':
      return '출석 인정 시간이 아닙니다.';
    case '1006':
      return '해당 강의는 주기적으로 확인하는 강의가 아닙니다.';
    case '4061':
      return '위치 정보가 올바르지 않습니다.';
    case '4035':
      return '종료된 기관입니다. 해당 기관에 문의해주세요.';
    case '4016':
      return '기기 변경 시 기관에 문의해주세요.';
    case '4034':
      return '기기 변경 시 기관에 문의해주세요.';
    default:
      return '문제가 발생하였습니다. 지속적으로 문제 발생시 기관에 문의해주세요.';
  }
};

export const attendList = (historyData: ScheduleHistoryDataProps) => {
  // 시간별 출결 리스트를 만들기 위한 데이터 포맷
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
