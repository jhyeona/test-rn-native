import {useQuery} from '@tanstack/react-query';

import {
  requestDeleteUser,
  requestGetInvitedAcademyList,
  requestGetUserInfo,
  requestPostJoinAcademy,
} from '#apis/user.ts';

export const useGetUserInfo = () => {
  const {data, refetch} = useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      return requestGetUserInfo();
    },
  });

  return {userData: data, refetchUserData: refetch};
};

export const useGetInvitedList = () => {
  const {data, refetch} = useQuery({
    queryKey: ['invitedList'],
    queryFn: async () => {
      return requestGetInvitedAcademyList();
    },
  });
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
