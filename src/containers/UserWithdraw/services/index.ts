import {requestDelete} from '#apis/index.ts';
import {ReqDeleteUser, UserInfoProps} from '#types/user.ts';

export const requestDeleteUser = async (
  payload: ReqDeleteUser,
): Promise<UserInfoProps> => {
  // 회원탈퇴
  const url = `/user/delete`;
  return requestDelete(url, {data: payload});
};
