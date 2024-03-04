import {requestGet, requestPost} from '#apis/index.ts';
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
import {ApiResponseProps} from '#types/common.ts';

export const requestGetDaySchedule = async (
  payload: GetScheduleProps,
): Promise<ApiResponseProps<ScheduleDataProps>> => {
  // 하루 일정 리스트
  const {academyId, date} = payload;
  const url = `/schedule/day/academy/${academyId}/date/${date}`;
  return requestGet(url);
};

export const requestGetWeekSchedule = async (
  payload: GetScheduleProps,
): Promise<ApiResponseProps<ScheduleDataProps>> => {
  // 주간 일정 리스트
  const {academyId, date} = payload;
  const url = `/schedule/week/academy/${academyId}/date/${date}`;
  return requestGet(url);
};

export const requestGetScheduleHistory = async (
  payload: GetScheduleHistoryProps,
): Promise<ApiResponseProps<ScheduleHistoryDataProps>> => {
  // 스케쥴에 대한 이벤트 히스토리 = 출석 기록
  const url = `/event/history/attendee/${payload.attendeeId}/schedule/${payload.scheduleId}`;
  return requestGet(url);
};

export const requestGetScheduleWeekHistory = async (
  payload: GetScheduleHistoryWeekProps,
): Promise<ApiResponseProps<ScheduleHistoryWeekDataProps>> => {
  // 스케쥴에 대한 기간별 이벤트 히스토리
  const url = `/event/history/academy/${payload.academyId}/start/${payload.startDate}/end/${payload.endDate}`;
  return requestGet(url);
};

export const requestGetEventHistory = async (payload: {
  academyId: number;
  startDate: string;
  endDate: string;
}): Promise<ApiResponseProps<SchedulePeriodDataProps>> => {
  // 기간별 이벤트 히스토리 조회
  const url = `/event/history/academy/${payload.academyId}/start/${payload.startDate}/end/${payload.endDate}`;
  return requestGet(url);
};

export const requestPostEventEnter = async (
  payload: PostEventProps,
): Promise<ApiResponseProps<ScheduleHistoryDataProps>> => {
  // 입실 요청
  const url = `/event/enter`;
  return requestPost(url, payload);
};

export const requestPostEventComplete = async (
  payload: PostEventProps,
): Promise<ApiResponseProps<ScheduleHistoryDataProps>> => {
  // 퇴실 요청
  const url = `/event/complete`;
  return requestPost(url, payload);
};

export const requestPostEventLeave = async (
  payload: PostEventProps,
): Promise<ApiResponseProps<ScheduleHistoryDataProps>> => {
  // 외출 요청
  const url = `/event/leave`;
  return requestPost(url, payload);
};

export const requestPostEventComeback = async (
  payload: PostEventProps,
): Promise<ApiResponseProps<ScheduleHistoryDataProps>> => {
  // 복귀 요청
  const url = `/event/comeback`;
  return requestPost(url, payload);
};

export const requestPostEventAttend = async (
  payload: PostEventProps,
): Promise<ApiResponseProps<ScheduleHistoryDataProps>> => {
  // 주기별 체크 요청
  const url = `/event/attend`;
  return requestPost(url, payload);
};

export const requestGetLectureInfo = async (
  payload: GetScheduleHistoryProps,
): Promise<ApiResponseProps<ScheduleHistoryDataProps>> => {
  // 강의 상세
  const url = `/event/history/attendee/${payload.attendeeId}/schedule/${payload.scheduleId}`;
  return requestGet(url);
};
