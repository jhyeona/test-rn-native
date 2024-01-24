import {requestGet, requestPatch} from './index.ts';
import {instanceWithoutToken} from './instance.ts';
import {ApiResponseProps} from '../types/common.ts';
import {SmsConfirmProps, UserInfoProps} from '../types/user.ts';

export const requestPostFindPassword = async (payload: {}): Promise<
  ApiResponseProps<null>
> => {
  // 비밀번호 찾기
  const url = '/user/forgot';
  return instanceWithoutToken.post(url, payload);
};

export const requestGetUserInfo = async (): Promise<
  ApiResponseProps<UserInfoProps>
> => {
  // 유저 정보
  const url = '/user/info';
  return requestGet(url);
};

export const requestPatchUserUpdate = async (args: {
  payload: {};
}): Promise<ApiResponseProps<UserInfoProps>> => {
  // 유저 정보 수정
  const url = '/user/update';
  const {payload} = args;
  return requestPatch(url, payload);
};
