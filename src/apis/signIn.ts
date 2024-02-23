import {ApiResponseProps} from '../types/common.ts';
import {GetAccessTokenProps} from '../types/user.ts';
import {instanceWithoutToken} from './instance.ts';
import {Alert} from 'react-native';

export const requestPostGetToken = async (payload: {
  phone: string;
  password: string;
}): Promise<ApiResponseProps<GetAccessTokenProps>> => {
  // 로그인
  const url = '/token/authenticate';

  return instanceWithoutToken.post(url, payload);
};
