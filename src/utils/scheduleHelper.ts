import moment, {Moment} from 'moment/moment';

/** 주어진 날짜가 오늘인지 */
export const getIsToday = (date: Moment) => {
  return moment().isSame(date, 'day');
};

/**
 * 주어진 날짜를 기준으로 해당 주의 주차
 * @param date - 기준 날짜
 * @return 날짜가 해당 월의 몇 주 차인지
 */
export const weekOfMonth = (date: Moment) => {
  const weekOfMonthNumber = (date: Moment) =>
    date.week() - moment(date).startOf('month').week() + 1;

  return `${date.format('YYYY년 MM월')} ${weekOfMonthNumber(date)}주차`;
};

/**
 * 시작 일시와 종료일시의 사이인지 여부
 */
export const isBetween = (startTime: Moment, endTime: Moment) => {
  return moment().isBetween(startTime, endTime, undefined, '[]');
};

/**
 * 주어진 날짜를 기준으로 해당 주의 월요일 날짜
 * @param date - 기준 날짜
 * @returns 해당 주의 월요일 날짜
 */
export const getMondayOfWeek = (date: Moment): Moment => {
  return date.clone().startOf('isoWeek'); // ISO 주의 시작은 월요일
};

/**
 * 주어진 날짜를 기준으로 해당 주의 모든 날짜 (월요일부터 일요일까지)
 * @param date - 기준 날짜
 * @returns 해당 주의 날짜 배열
 */
export const getDatesOfWeek = (date: Moment): Moment[] => {
  const monday = getMondayOfWeek(date);
  return Array.from({length: 7}, (_, index) =>
    monday.clone().add(index, 'days'),
  );
};
