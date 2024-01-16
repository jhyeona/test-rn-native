import {requestGet} from './index.ts';

export const requestGetDaySchedule = async (date: string) => {
  // 하루 일정 리스트
  const url = `/schedule/day/${date}`;
  return requestGet(url);
};

export const requestGetWeekSchedule = async (date: string) => {
  // 주간 일정 리스트
  const url = `/schedule/week/${date}`;
  return requestGet(url);
};
