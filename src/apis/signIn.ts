import {requestPost} from './index.ts';

export const requestPostGetToken = async (args: {data: {}}) => {
  // 로그인
  const url = '/token/authenticate';
  const {data} = args;
  return requestPost(url, data);
};
