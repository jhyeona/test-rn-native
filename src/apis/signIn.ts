import {requestPost} from './index.ts';
import {ApiResponseProps} from '../types/common.ts';
import {GetAccessTokenProps} from '../types/user.ts';

export const requestPostGetToken = async (args: {
  payload: {};
}): Promise<ApiResponseProps<GetAccessTokenProps>> => {
  // 로그인
  const url = '/token/authenticate';
  const {payload} = args;
  return requestPost(url, payload);
};
