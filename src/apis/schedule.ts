import {requestGet, requestPost} from './index.ts';
import {
  DayScheduleProps,
  EventDetailProps,
  EventProps,
  GetScheduleHistoryProps,
  GetScheduleProps,
  WeekScheduleProps,
} from '../types/schedule.ts';
import {ApiResponseProps} from '../types/common.ts';

export const requestGetDaySchedule = async (
  payload: GetScheduleProps,
): Promise<ApiResponseProps<DayScheduleProps>> => {
  // 하루 일정 리스트
  const {academyId, date} = payload;
  const url = `/schedule/day/academy/${academyId}/date/${date}`;
  return requestGet(url);
};

export const requestGetWeekSchedule = async (
  payload: GetScheduleProps,
): Promise<ApiResponseProps<WeekScheduleProps>> => {
  // 주간 일정 리스트
  const {academyId, date} = payload;
  const url = `/schedule/week/academy/${academyId}/date/${date}`;
  return requestGet(url);
};

export const requestGetScheduleHistory = async (
  payload: GetScheduleHistoryProps,
): Promise<ApiResponseProps<EventDetailProps>> => {
  // 스케쥴에 대한 이벤트 히스토리 = 출석 기록
  const url = `/event/history/attendee/${payload.attendeeId}/schedule/${payload.scheduleId}`;
  return requestGet(url);
};

export const requestPostEventEnter = async (
  payload: EventProps,
): Promise<ApiResponseProps<EventDetailProps>> => {
  // 입실 요청
  const url = `/event/enter`;
  return requestPost(url, payload);
};

export const requestPostEventComplete = async (
  payload: EventProps,
): Promise<ApiResponseProps<EventDetailProps>> => {
  // 퇴실 요청
  const url = `/event/complete`;
  return requestPost(url, payload);
};

export const requestPostEventLeave = async (
  payload: EventProps,
): Promise<ApiResponseProps<EventDetailProps>> => {
  // 외출 요청
  const url = `/event/leave`;
  return requestPost(url, payload);
};

export const requestPostEventComeback = async (
  payload: EventProps,
): Promise<ApiResponseProps<EventDetailProps>> => {
  // 복귀 요청
  const url = `/event/comeback`;
  return requestPost(url, payload);
};

export const requestPostEventAttend = async (
  payload: EventProps,
): Promise<ApiResponseProps<EventDetailProps>> => {
  // 주기별 체크 요청
  const url = `/event/attend`;
  return requestPost(url, payload);
};
