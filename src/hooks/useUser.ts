import {useEffect} from 'react';

import {useQuery} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {
  requestDeleteUser,
  requestGetInvitedAcademyList,
  requestGetUserInfo,
  requestPostJoinAcademy,
} from '#apis/user.ts';
import GlobalState from '#recoil/Global';

export const useGetUserInfo = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);

  const {data, refetch, status, fetchStatus} = useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      return requestGetUserInfo();
    },
  });
  useEffect(() => {
    setIsLoading(true);
    if (status === 'success' || status === 'error') {
      setIsLoading(false);
    }
  }, [status, fetchStatus]);

  return {userData: data, refetchUserData: refetch};
};

export const useGetInvitedList = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);

  const {data, refetch, status, fetchStatus} = useQuery({
    queryKey: ['invitedList'],
    queryFn: async () => {
      return requestGetInvitedAcademyList();
    },
  });

  useEffect(() => {
    setIsLoading(true);
    if (status === 'success' || status === 'error') {
      setIsLoading(false);
    }
  }, [status, fetchStatus]);

  return {data, refetch};
};

export const postJoinAcademy = async (payload: {
  inviteIdList: Array<string>;
}) => {
  const response = await requestPostJoinAcademy(payload);
  return response;
};

export const deleteUser = async (payload: {password: string}) => {
  const response = await requestDeleteUser(payload);
  return response;
};
