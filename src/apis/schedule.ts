import {requestGet, requestPost} from '#apis/index.ts';
import {ApiResponseProps} from '#types/common.ts';
import {
  GetScheduleHistoryProps,
  GetScheduleHistoryWeekProps,
  GetScheduleProps,
  PostEventProps,
  ScheduleDataProps,
  ScheduleHistoryDataProps,
  ScheduleHistoryWeekDataProps,
  SchedulePeriodDataProps,
} from '#types/schedule.ts';

export const requestGetWeekSchedule = async (
  payload: GetScheduleProps,
): Promise<ScheduleDataProps> => {
  // 주간 일정 리스트
  const {academyId, date} = payload;
  const url = `/schedule/week/academy/${academyId}/date/${date}`;
  return requestGet(url);
};

export const requestGetEventHistory = async (payload: {
  academyId: string;
  startDate: string;
  endDate: string;
}): Promise<SchedulePeriodDataProps> => {
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
