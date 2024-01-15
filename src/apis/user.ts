import {requestGet} from './index.ts';

export const requestGetUserInfo = async () => {
  // 유저 정보
  const url = '/user/info';
  return requestGet(url);
};
