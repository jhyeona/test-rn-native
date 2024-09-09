/** 주간 캘린더의 날짜 데이터를 생성하는 함수 */
import {Moment} from 'moment/moment';

export interface CalendarItem {
  date: Moment;
  key: string;
}

export const generateWeekDates = (
  start: Moment,
  numberOfDays: number,
): CalendarItem[] => {
  const dates: CalendarItem[] = [];
  for (let i = 0; i < numberOfDays; i++) {
    const date = start.clone().add(i, 'day');
    dates.push({date, key: date.format('YYYY-MM-DD')});
  }
  return dates;
};
