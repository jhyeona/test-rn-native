import {useQuery} from '@tanstack/react-query';

import {requestGetUserInfo} from '#apis/user.ts';
import {useHandleError, useLoadingEffect} from '#hooks/useApi.ts';

export const useGetUserInfo = () => {
  const {data, refetch, status, fetchStatus, error, isError} = useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      return requestGetUserInfo();
    },
  });

  useLoadingEffect(status, fetchStatus);
  useHandleError(isError, error);

  return {userData: data, refetchUserData: refetch};
};
