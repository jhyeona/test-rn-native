import {requestGet} from '#apis/index.ts';
import {GetScheduleProps, ScheduleDataProps} from '#types/schedule.ts';

export const requestGetWeekSchedule = async (
  payload: GetScheduleProps,
): Promise<ScheduleDataProps> => {
  // 주간 일정 리스트
  const {academyId, date} = payload;
  const url = `/schedule/week/academy/${academyId}/date/${date}`;
  return requestGet(url);
};
