import {requestPost} from '../utils/requestHelper.ts';

export const requestPostGetToken = async (args: {url: string; data: {}}) => {
  // 로그인
  const {url, data} = args;
  return requestPost(url, data);
};
