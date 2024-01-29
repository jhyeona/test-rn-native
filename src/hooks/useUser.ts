import {requestGetUserInfo} from '../apis/user.ts';
import {useSetRecoilState} from 'recoil';
import userState from '../recoil/user';
import {useQuery} from '@tanstack/react-query';
import {useEffect} from 'react';

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
