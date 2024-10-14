import {useEffect} from 'react';

import {useMutation, useQuery} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {
  requestGetInvitedAcademyList,
  requestPostJoinAcademy,
} from '#containers/Academy/services';
import {useHandleError} from '#hooks/useApi.ts';
import GlobalState from '#recoil/Global';
import {CommonResponseProps} from '#types/common.ts';
import {ReqJoinAcademyProps} from '#types/user.ts';

export const useGetInvitedList = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);

  const {data, refetch, status, fetchStatus, error, isError} = useQuery({
    queryKey: ['invitedList'],
    queryFn: async () => {
      return requestGetInvitedAcademyList();
    },
  });

  useHandleError(isError, error);
  useEffect(() => {
    setIsLoading(status === 'pending' && fetchStatus === 'fetching');
  }, [status, fetchStatus]);

  return {
    data,
    refetch,
    isLoading: status === 'pending' && fetchStatus === 'fetching',
  };
};

export const useJoinAcademy = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  const {mutateAsync: joinAcademy} = useMutation({
    mutationFn: (payload: ReqJoinAcademyProps) => {
      return requestPostJoinAcademy(payload);
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
        message: '선택한 기관이 추가되었습니다.',
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

  return {joinAcademy};
};
