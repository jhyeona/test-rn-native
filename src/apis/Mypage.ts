import {requestPatch} from './index.ts';

export const requestPatchUserUpdate = async (args: {data: {}}) => {
  // 유저 정보 수정
  const url = '/user/update';
  const {data} = args;
  return requestPatch(url, data);
};
