import {useQuery} from '@tanstack/react-query';

import {requestGetAppVersions, requestGetCheckUuid, requestGetUserInfo} from '#apis/user.ts';
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

export const useGetCheckUuid = (deviceUuid?: string) => {
  const {data, refetch, status, fetchStatus} = useQuery({
    queryKey: ['checkUuidList'],
    queryFn: async () => {
      return requestGetCheckUuid(deviceUuid);
    },
    enabled: !!deviceUuid,
  });

  useLoadingEffect(status, fetchStatus);
  // useHandleError(isError, error);  // 에러일 때는 아무 동작도 하지 않음.

  return {uuidCheckedList: data?.length ? data : [], refetchCheckUuid: refetch};
};

export const useGetAppVersions = () => {
  const {data, refetch, status, fetchStatus, error, isError} = useQuery({
    queryKey: ['appVersions'],
    queryFn: async () => {
      return requestGetAppVersions();
    },
  });

  useLoadingEffect(status, fetchStatus);
  useHandleError(isError, error);

  return {appVersions: data?.data.data, refetch};
};
