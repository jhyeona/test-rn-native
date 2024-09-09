import {requestGet} from '#apis/index.ts';
import {
  GetScheduleHistoryProps,
  GetScheduleProps,
  ScheduleDataProps,
  ScheduleHistoryDataProps,
} from '#types/schedule.ts';

export const requestGetDaySchedule = async (
  payload: GetScheduleProps,
): Promise<ScheduleDataProps> => {
  // 하루 일정 리스트
  const {academyId, date} = payload;
  const url = `/schedule/day/academy/${academyId}/date/${date}`;
  return requestGet(url);
};

export const requestGetScheduleHistory = async (
  payload: GetScheduleHistoryProps,
): Promise<ScheduleHistoryDataProps> => {
  // 스케쥴에 대한 이벤트 히스토리 = 출석 기록
  const url = `/event/history/attendee/${payload.attendeeId}/schedule/${payload.scheduleId}`;
  return requestGet(url);
};
