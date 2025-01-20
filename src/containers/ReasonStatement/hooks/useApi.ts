import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {requestCreateReason, requestUpdateReason} from '#containers/ReasonStatement/services';
import {ReasonQueryOptions} from '#containers/ReasonStatement/services/queries.ts';
import {useHandleError, useInvalidateQueriesAndShowModal, useLoadingEffect} from '#hooks/useApi.ts';
import GlobalState from '#recoil/Global';
import {CommonResponseProps} from '#types/common.ts';
import {ReqGetReasonDetails, ReqGetReasonList} from '#types/reason.ts';

// 캐시 데이터를 초기화할 쿼리키 리스트
const INVALID_QUERY_KEYS = ['reasonList'];

// 사유서 리스트
export const useGetReasonList = (payload: ReqGetReasonList) => {
  const {data, status, fetchStatus, isError, error, refetch, isFetchingNextPage, ...result} =
    useInfiniteQuery({
      ...ReasonQueryOptions.getReasonList(payload),
      getNextPageParam: (lastPage, allPages) => {
        return lastPage ? allPages.length + 1 : undefined;
      },
    });

  useLoadingEffect(status, fetchStatus);
  useHandleError(isError, error);

  return {
    reasonList: data?.pages.map(page => page.content).flat() ?? [],
    refetchReasonList: refetch,
    isReasonLoading: isFetchingNextPage,
    ...result,
  };
};

// 사유서 상세
export const useGetReasonDetails = (payload: ReqGetReasonDetails) => {
  const {data, refetch, status, fetchStatus, error, isError} = useQuery(
    ReasonQueryOptions.getReasonDetails(payload),
  );

  useLoadingEffect(status, fetchStatus);
  useHandleError(isError, error);

  return {reasonDetails: data, refetchReasonDetails: refetch};
};

// 사유서 작성
export const useCreateReason = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);
  const invalidateQueriesAndShowModal = useInvalidateQueriesAndShowModal();

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
    onSuccess: async () => {
      await invalidateQueriesAndShowModal(INVALID_QUERY_KEYS, '사유서가 작성되었습니다.');
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
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);
  const invalidateQueriesAndShowModal = useInvalidateQueriesAndShowModal();

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
    onSuccess: async () => {
      await invalidateQueriesAndShowModal(INVALID_QUERY_KEYS, '사유서가 수정되었습니다.');
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
