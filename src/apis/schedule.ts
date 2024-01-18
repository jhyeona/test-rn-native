import {requestGet} from './index.ts';
import {GetScheduleProps} from '../types/schedule.ts';

export const requestGetDaySchedule = async (data: GetScheduleProps) => {
  // 하루 일정 리스트
  const {academyId, date} = data;
  const url = `/schedule/day/academy/${academyId}/date/${date}`;
  return requestGet(url);
};

export const requestGetWeekSchedule = async (date: string) => {
  // 주간 일정 리스트
  const url = `/schedule/week/${date}`;
  return requestGet(url);
};
