// 유저 비밀번호 수정
import {requestPatch} from '#apis/index.ts';
import {ReqPasswordType, UserInfoProps} from '#types/user.ts';

export const requestPatchUpdatePassword = async (
  payload: ReqPasswordType,
): Promise<UserInfoProps> => {
  const url = '/user/update/password';
  return requestPatch(url, payload);
};
