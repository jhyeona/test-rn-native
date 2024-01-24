import {requestPost} from './index.ts';
import {ApiResponseProps} from '../types/common.ts';
import {GetAccessTokenProps} from '../types/user.ts';

export const requestPostGetToken = async (payload: {
  phone: string;
  password: string;
}): Promise<ApiResponseProps<GetAccessTokenProps>> => {
  // 로그인
  const url = '/token/authenticate';
  return requestPost(url, payload);
};
