import {requestDelete} from '#apis/index.ts';
import {ReqPasswordType, UserInfoProps} from '#types/user.ts';

export const requestDeleteUser = async (payload: ReqPasswordType): Promise<UserInfoProps> => {
  // 회원탈퇴
  const url = `/user/delete`;
  return requestDelete(url, {data: payload});
};
