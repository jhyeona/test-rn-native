import {useEffect} from 'react';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {
  requestCreateReason,
  requestUpdateReason,
} from '#containers/ReasonStatement/services';
import {ReasonQueryOptions} from '#containers/ReasonStatement/services/queries.ts';
import GlobalState from '#recoil/Global';
import {CommonResponseProps} from '#types/common.ts';
import {ReqGetReasonDetails, ReqGetReasonList} from '#types/reason.ts';

// 사유서 리스트
export const useGetReasonList = (payload: ReqGetReasonList) => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const {data, refetch, status, fetchStatus} = useQuery(
    ReasonQueryOptions.getReasonList(payload),
  );

  useEffect(() => {
    setIsLoading(status === 'pending' && fetchStatus === 'fetching');
  }, [status, fetchStatus]);

  useEffect(() => {
    console.log(data?.content.length);
  }, [data]);

  return {reasonList: data, refetchReasonList: refetch};
};

// 사유서 상세
export const useGetReasonDetails = (payload: ReqGetReasonDetails) => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const {data, refetch, status, fetchStatus} = useQuery(
    ReasonQueryOptions.getReasonDetails(payload),
  );

  useEffect(() => {
    setIsLoading(status === 'pending' && fetchStatus === 'fetching');
  }, [status, fetchStatus]);

  return {reasonDetails: data, refetchReasonDetails: refetch};
};

// 사유서 작성
export const useCreateReason = () => {
  const queryClient = useQueryClient();

  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  const {mutateAsync: createReason} = useMutation({
    mutationFn: (payload: FormData) => {
      return requestCreateReason(payload);
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: ['reasonList'],
        })
        .then();
      setModalState({
        isVisible: true,
        title: '안내',
        message: '사유서가 작성되었습니다.',
      });
    },
    onError: (error: CommonResponseProps<null>) => {
      setModalState({
        isVisible: true,
        title: '안내',
        message: error.message ?? '',
      });
    },
  });
  return {createReason};
};

// 사유서 수정
export const useUpdateReason = () => {
  const queryClient = useQueryClient();

  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  const {mutateAsync: updateReason} = useMutation({
    mutationFn: (payload: FormData) => {
      return requestUpdateReason(payload);
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: ['reasonList'],
        })
        .then();
      setModalState({
        isVisible: true,
        title: '안내',
        message: '사유서가 수정되었습니다.',
      });
    },
    onError: (error: CommonResponseProps<null>) => {
      setModalState({
        isVisible: true,
        title: '안내',
        message: error.message ?? '',
      });
    },
  });
  return {updateReason};
};
