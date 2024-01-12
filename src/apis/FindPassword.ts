import {requestPost} from '../utils/requestHelper.ts';

export const requestPostFindPassword = async (args: {data: {}}) => {
  // 비밀번호 찾기
  const url = '/user/forgot';
  const {data} = args;
  return requestPost(url, data);
};
