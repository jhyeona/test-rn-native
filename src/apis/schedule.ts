import {requestGet} from '#apis/index.ts';
import {
  GetScheduleHistoryProps,
  GetScheduleProps,
  ScheduleDataProps,
  ScheduleHistoryDataProps,
  ResSchedulePeriodDataProps,
  ReqGetScheduleHistory,
} from '#types/schedule.ts';

export const requestGetWeekSchedule = async (
  payload: GetScheduleProps,
): Promise<ScheduleDataProps> => {
  // 주간 일정 리스트
  const {academyId, date} = payload;
  const url = `/schedule/week/academy/${academyId}/date/${date}`;
  return requestGet(url);
};

export const requestGetEventHistory = async (
  payload: ReqGetScheduleHistory,
): Promise<ResSchedulePeriodDataProps> => {
  // 기간별 이벤트 히스토리 조회
  const url = `/event/history/academy/${payload.academyId}/start/${payload.startDate}/end/${payload.endDate}`;
  return requestGet(url);
};

export const requestGetLectureInfo = async (
  payload: GetScheduleHistoryProps,
): Promise<ScheduleHistoryDataProps> => {
  // 강의 상세
  const url = `/event/history/attendee/${payload.attendeeId}/schedule/${payload.scheduleId}`;
  return requestGet(url);
};
