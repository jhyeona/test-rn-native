import {
  requestGetInvitedAcademyList,
  requestGetUserInfo,
  requestPostFindPassword,
  requestPostJoinAcademy,
} from '../apis/user.ts';
import {useSetRecoilState} from 'recoil';
import userState from '../recoil/user';
import {useQuery} from '@tanstack/react-query';
import {useEffect} from 'react';

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
  const setUserInfo = useSetRecoilState(userState.userInfoState);
  const {data} = useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      return getUserInfo();
    },
  });
  useEffect(() => {
    if (!data) return;
    setUserInfo(data);
  }, [data, setUserInfo]);
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

export const postJoinAcademy = async (payload: Array<number>) => {
  const response = await requestPostJoinAcademy(payload);
  return response.data?.data;
};
