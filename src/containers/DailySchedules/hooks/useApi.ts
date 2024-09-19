import {useEffect} from 'react';

import {useMutation, useQuery} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {
  requestPostEventAttend,
  requestPostEventComeback,
  requestPostEventComplete,
  requestPostEventEnter,
  requestPostEventLeave,
} from '#containers/DailySchedules/services';
import {ScheduleQueryOptions} from '#containers/DailySchedules/services/queries.ts';
import GlobalState from '#recoil/Global';
import {CommonResponseProps} from '#types/common.ts';
import {
  GetScheduleHistoryProps,
  GetScheduleProps,
  PostEventProps,
} from '#types/schedule.ts';
import {handleErrorResponse} from '#utils/scheduleHelper.ts';

// 하루 일정
export const useGetDaySchedule = (payload: GetScheduleProps) => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const {data, refetch, status, fetchStatus} = useQuery(
    ScheduleQueryOptions.getDaySchedules(payload),
  );

  useEffect(() => {
    setIsLoading(status === 'pending' && fetchStatus === 'fetching');
  }, [status, fetchStatus]);

  return {dayScheduleData: data, refetchDaySchedule: refetch};
};

// 일정에 기록된 스케쥴 데이터
export const useGetScheduleHistory = (payload: GetScheduleHistoryProps) => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const {data, status, refetch, fetchStatus} = useQuery(
    ScheduleQueryOptions.getDayScheduleHistory(payload),
  );

  useEffect(() => {
    setIsLoading(true);
    if (status === 'success' || status === 'error') {
      setIsLoading(false);
    }
  }, [status, fetchStatus]);

  return {historyData: data, refetchHistoryData: refetch};
};

// 입실 요청
export const useReqEnter = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  const {mutateAsync: reqEnterEvent} = useMutation({
    mutationFn: (payload: PostEventProps) => {
      return requestPostEventEnter(payload);
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: () => {
      setModalState({
        isVisible: true,
        title: '안내',
        message: '입실 처리 되었습니다.',
      });
    },
    onError: (error: CommonResponseProps<null>) => {
      const errorMessage = handleErrorResponse(error.code);
      console.log(error);
      setModalState({
        isVisible: true,
        title: '안내',
        message: errorMessage ?? '',
      });
    },
  });
  return {reqEnterEvent};
};

// 퇴실 요청
export const useReqComplete = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  const {mutateAsync: reqCompleteEvent} = useMutation({
    mutationFn: (payload: PostEventProps) => {
      return requestPostEventComplete(payload);
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: () => {
      setModalState({
        isVisible: true,
        title: '안내',
        message: '퇴실 처리 되었습니다.',
      });
    },
    onError: (error: CommonResponseProps<null>) => {
      const errorMessage = handleErrorResponse(error.code);
      console.log(error);
      setModalState({
        isVisible: true,
        title: '안내',
        message: errorMessage ?? '',
      });
    },
  });
  return {reqCompleteEvent};
};

// 외출 요청
export const useReqLeave = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  const {mutateAsync: reqLeaveEvent} = useMutation({
    mutationFn: (payload: PostEventProps) => {
      return requestPostEventLeave(payload);
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: () => {
      setModalState({
        isVisible: true,
        title: '안내',
        message: '외출 처리 되었습니다.',
      });
    },
    onError: (error: CommonResponseProps<null>) => {
      const errorMessage = handleErrorResponse(error.code);
      console.log(error);
      setModalState({
        isVisible: true,
        title: '안내',
        message: errorMessage ?? '',
      });
    },
  });
  return {reqLeaveEvent};
};

// 복귀 요청
export const useReqComeback = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  const {mutateAsync: reqComebackEvent} = useMutation({
    mutationFn: (payload: PostEventProps) => {
      return requestPostEventComeback(payload);
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: () => {
      setModalState({
        isVisible: true,
        title: '안내',
        message: '외출이 종료 되었습니다.',
      });
    },
    onError: (error: CommonResponseProps<null>) => {
      const errorMessage = handleErrorResponse(error.code);
      console.log(error);
      setModalState({
        isVisible: true,
        title: '안내',
        message: errorMessage ?? '',
      });
    },
  });
  return {reqComebackEvent};
};

// 시간별 체크 요청
export const useReqAttend = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  const {mutateAsync: reqAttendEvent} = useMutation({
    mutationFn: (payload: PostEventProps) => {
      return requestPostEventAttend(payload);
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: () => {
      setModalState({
        isVisible: true,
        title: '안내',
        message: '출석 처리 되었습니다.',
      });
    },
    onError: (error: CommonResponseProps<null>) => {
      const errorMessage = handleErrorResponse(error.code);
      console.log(error);
      setModalState({
        isVisible: true,
        title: '안내',
        message: errorMessage ?? '',
      });
    },
  });
  return {reqAttendEvent};
};
