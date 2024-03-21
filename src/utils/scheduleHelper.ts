import moment, {Moment} from 'moment/moment';

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
