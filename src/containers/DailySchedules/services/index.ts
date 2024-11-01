import {requestGet, requestPost} from '#apis/index.ts';
import {
  GetScheduleHistoryProps,
  GetScheduleProps,
  LectureProps,
  PostEventProps,
  ScheduleDataProps,
  ScheduleHistoryDataProps,
} from '#types/schedule.ts';

export const requestGetLectureList = async (academyId: string): Promise<LectureProps[]> => {
  // 선택된 기관의 강의 리스트
  const url = `/lecture/list/academy/${academyId}`;
  return requestGet(url);
};

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
  const url = `/event/history/schedule/${payload.scheduleId}`;
  return requestGet(url);
};

export const requestPostEventEnter = async (
  payload: PostEventProps,
): Promise<ScheduleHistoryDataProps> => {
  // 입실 요청
  const url = `/event/enter`;
  return requestPost(url, payload);
};

export const requestPostEventComplete = async (
  payload: PostEventProps,
): Promise<ScheduleHistoryDataProps> => {
  // 퇴실 요청
  const url = `/event/complete`;
  return requestPost(url, payload);
};

export const requestPostEventLeave = async (
  payload: PostEventProps,
): Promise<ScheduleHistoryDataProps> => {
  // 외출 요청
  const url = `/event/leave`;
  return requestPost(url, payload);
};

export const requestPostEventComeback = async (
  payload: PostEventProps,
): Promise<ScheduleHistoryDataProps> => {
  // 복귀 요청
  const url = `/event/comeback`;
  return requestPost(url, payload);
};

export const requestPostEventAttend = async (
  payload: PostEventProps,
): Promise<ScheduleHistoryDataProps> => {
  // 주기별 체크 요청
  const url = `/event/attend`;
  return requestPost(url, payload);
};
