import {useMutation, useQuery} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {requestGetInvitedAcademyList, requestPostJoinAcademy} from '#containers/Academy/services';
import {useHandleError, useLoadingEffect} from '#hooks/useApi.ts';
import GlobalState from '#recoil/Global';
import {CommonResponseProps} from '#types/common.ts';
import {ReqJoinAcademyProps} from '#types/user.ts';

export const useGetInvitedList = () => {
  const {data, refetch, status, fetchStatus, error, isError} = useQuery({
    queryKey: ['invitedList'],
    queryFn: async () => {
      return requestGetInvitedAcademyList();
    },
  });

  useLoadingEffect(status, fetchStatus);
  useHandleError(isError, error);

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
