import {useQuery} from '@tanstack/react-query';

import {
  requestDeleteUser,
  requestGetInvitedAcademyList,
  requestGetUserInfo,
  requestPostFindPassword,
  requestPostJoinAcademy,
} from '#apis/user.ts';

export const postFindPassword = async (payload: {
  phone: string;
  name: string;
  birth: string;
}) => {
  const response = await requestPostFindPassword(payload);
  return response;
};

export const useGetUserInfo = () => {
  const {data, refetch} = useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      return requestGetUserInfo();
    },
  });

  return {userData: data, refetchUserData: refetch};
};

export const getInvitedAcademyList = async () => {
  const response = await requestGetInvitedAcademyList();
  return response;
};

export const useGetInvitedList = () => {
  const {data, refetch} = useQuery({
    queryKey: ['invitedList'],
    queryFn: async () => {
      return getInvitedAcademyList();
    },
  });
  return {data, refetch};
};

export const postJoinAcademy = async (payload: {
  inviteIdList: Array<number>;
}) => {
  const response = await requestPostJoinAcademy(payload);
  return response;
};

export const deleteUser = async (payload: {password: string}) => {
  const response = await requestDeleteUser(payload);
  return response;
};
