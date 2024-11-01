import {requestPatch} from '#apis/index.ts';
import {ReqUpdatePush, UserInfoProps} from '#types/user.ts';

// 푸시 알림 설정 수정
export const requestPatchUpdatePush = async (payload: ReqUpdatePush): Promise<UserInfoProps> => {
  const url = '/user/update/push';
  return requestPatch(url, payload);
};
