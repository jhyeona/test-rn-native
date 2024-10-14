import {useEffect} from 'react';

import {useQuery} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {requestGetUserInfo} from '#apis/user.ts';
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
    setIsLoading(status === 'pending' && fetchStatus === 'fetching');
  }, [status, fetchStatus]);

  return {userData: data, refetchUserData: refetch};
};
