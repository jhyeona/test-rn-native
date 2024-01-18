import {requestGet, requestPatch} from './index.ts';
import {instanceWithoutToken} from './instance.ts';

export const requestPostFindPassword = async (data: {}) => {
  // 비밀번호 찾기
  const url = '/user/forgot';
  return instanceWithoutToken.post(url, data);
};

export const requestGetUserInfo = async () => {
  // 유저 정보
  const url = '/user/info';
  return requestGet(url);
};

export const requestPatchUserUpdate = async (args: {data: {}}) => {
  // 유저 정보 수정
  const url = '/user/update';
  const {data} = args;
  return requestPatch(url, data);
};
