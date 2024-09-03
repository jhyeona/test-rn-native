import {useEffect} from 'react';

import {useQuery} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {
  requestDeleteUser,
  requestGetInvitedAcademyList,
  requestGetUserInfo,
  requestPostFindPassword,
  requestPostJoinAcademy,
} from '#apis/user.ts';
import userState from '#recoil/User';

export const postFindPassword = async (payload: {
  phone: string;
  name: string;
  birth: string;
}) => {
  const response = await requestPostFindPassword(payload);
  return response.data?.data;
};

export const getUserInfo = async () => {
  const response = await requestGetUserInfo();
  return response.data?.data;
};

export const useGetUserInfo = () => {
  const {data, refetch} = useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      return getUserInfo();
    },
  });

  return {userData: data, refetchUserData: refetch};
};

export const getInvitedAcademyList = async () => {
  const response = await requestGetInvitedAcademyList();
  return response.data?.data;
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
  return response.data?.data;
};

export const deleteUser = async (payload: {password: string}) => {
  const response = await requestDeleteUser(payload);
  return response.data?.data;
};
