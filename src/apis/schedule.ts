import {requestGet, requestPost} from './index.ts';
import {
  EventProps,
  GetScheduleHistoryProps,
  GetScheduleProps,
} from '../types/schedule.ts';

export const requestGetDaySchedule = async (data: GetScheduleProps) => {
  // 하루 일정 리스트
  const {academyId, date} = data;
  const url = `/schedule/day/academy/${academyId}/date/${date}`;
  return requestGet(url);
};

export const requestGetWeekSchedule = async (data: GetScheduleProps) => {
  // 주간 일정 리스트
  const {academyId, date} = data;
  const url = `/schedule/week/academy/${academyId}/date/${date}`;
  return requestGet(url);
};

export const requestGetScheduleHistory = async (
  data: GetScheduleHistoryProps,
) => {
  // 스케쥴에 대한 이벤트 히스토리 = 출석 기록
  const url = `/event/history/attendee/${data.attendeeId}/schedule/${data.scheduleId}`;
  return requestGet(url);
};

export const requestPostEventEnter = async (data: EventProps) => {
  // 입실 요청
  const url = `/event/enter`;
  return requestPost(url, data);
};

export const requestPostEventComplete = async (data: EventProps) => {
  // 퇴실 요청
  const url = `/event/complete`;
  return requestPost(url, data);
};

export const requestPostEventLeave = async (data: EventProps) => {
  // 외출 요청
  const url = `/event/leave`;
  return requestPost(url, data);
};

export const requestPostEventComeback = async (data: EventProps) => {
  // 복귀 요청
  const url = `/event/comeback`;
  return requestPost(url, data);
};

export const requestPostEventAttend = async (data: EventProps) => {
  // 주기별 체크 요청
  const url = `/event/attend`;
  return requestPost(url, data);
};
