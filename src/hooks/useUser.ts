import {useQuery} from '@tanstack/react-query';

import {requestGetUserInfo} from '#apis/user.ts';
import {useLoadingEffect} from '#hooks/useApi.ts';

export const useGetUserInfo = () => {
  const {data, refetch, status, fetchStatus} = useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      return requestGetUserInfo();
    },
  });

  useLoadingEffect(status, fetchStatus);

  return {userData: data, refetchUserData: refetch};
};
