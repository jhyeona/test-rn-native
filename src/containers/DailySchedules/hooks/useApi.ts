import {useEffect, useState} from 'react';

import {useMutation, useQuery} from '@tanstack/react-query';
import {useRecoilValue, useSetRecoilState} from 'recoil';

import {ItemProps} from '#components/common/Dropdown/Dropdown.tsx';
import {eventSuccessMessage} from '#constants/responseMessage.ts';
import {
  requestPostEventAttend,
  requestPostEventComeback,
  requestPostEventComplete,
  requestPostEventEnter,
  requestPostEventLeave,
} from '#containers/DailySchedules/services';
import {ScheduleQueryOptions} from '#containers/DailySchedules/services/queries.ts';
import {showErrorModal} from '#containers/DailySchedules/utils/modalHelper.ts';
import {useHandleError, useInvalidateQueriesAndShowModal, useLoadingEffect} from '#hooks/useApi.ts';
import GlobalState from '#recoil/Global';
import {CommonResponseProps} from '#types/common.ts';
import {GetScheduleHistoryProps, GetScheduleProps, PostEventProps} from '#types/schedule.ts';

// 캐시 데이터를 초기화할 쿼리키 리스트
const INVALID_QUERY_KEYS = ['daySchedule', 'scheduleHistory'];

// 선택된 기관의 강의 리스트
export const useGetLectureList = (academyId?: string) => {
  const selectedAcademy = useRecoilValue(GlobalState.selectedAcademy);
  const [lectureItems, setLectureItems] = useState<ItemProps[]>([]);

  const {data, refetch, status, fetchStatus, isError, error} = useQuery(
    ScheduleQueryOptions.getLectureList(academyId ?? selectedAcademy),
  );

  useLoadingEffect(status, fetchStatus);
  useHandleError(isError, error);

  useEffect(() => {
    // 드롭다운에 사용될 기관 리스트
    const formattedData =
      data?.map(lecture => {
        return {label: lecture.lectureName, id: lecture.lectureId};
      }) ?? [];
    setLectureItems(formattedData);
  }, [data]);

  return {lectureList: data, lectureItems, refetchLectureList: refetch};
};

// 하루 일정
export const useGetDaySchedule = (payload: GetScheduleProps) => {
  const {data, refetch, status, fetchStatus, isError, error} = useQuery(
    ScheduleQueryOptions.getDaySchedules(payload),
  );

  useLoadingEffect(status, fetchStatus);
  useHandleError(isError, error);

  return {dayScheduleData: data, refetchDaySchedule: refetch};
};

// 일정에 기록된 스케쥴 데이터
export const useGetScheduleHistory = (payload: GetScheduleHistoryProps) => {
  const {data, status, refetch, fetchStatus, isError, error} = useQuery(
    ScheduleQueryOptions.getDayScheduleHistory(payload),
  );

  useLoadingEffect(status, fetchStatus);
  useHandleError(isError, error);

  return {historyData: data, refetchHistoryData: refetch};
};

// 이벤트 요청 처리 공통 훅
const useRequestEvent = (
  mutationFn: (payload: PostEventProps) => Promise<any>,
  successMessage: string,
) => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);
  const invalidateQueriesAndShowModal = useInvalidateQueriesAndShowModal();

  const {mutateAsync} = useMutation({
    mutationFn,
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: async () => {
      await invalidateQueriesAndShowModal(INVALID_QUERY_KEYS, successMessage);
    },
    onError: (error: CommonResponseProps<null>) => {
      showErrorModal(error.code, setModalState);
    },
  });

  return {mutateAsync};
};

// 입실 요청
export const useReqEnter = () => {
  return useRequestEvent(requestPostEventEnter, eventSuccessMessage.ENTER);
};

// 퇴실 요청
export const useReqComplete = () => {
  return useRequestEvent(requestPostEventComplete, eventSuccessMessage.COMPLETE);
};

// 외출 요청
export const useReqLeave = () => {
  return useRequestEvent(requestPostEventLeave, eventSuccessMessage.LEAVE);
};

// 복귀 요청
export const useReqComeback = () => {
  return useRequestEvent(requestPostEventComeback, eventSuccessMessage.COMEBACK);
};

// 시간별 체크 요청
export const useReqAttend = () => {
  return useRequestEvent(requestPostEventAttend, eventSuccessMessage.ATTEND);
};
