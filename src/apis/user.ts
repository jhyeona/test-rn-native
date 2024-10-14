import {requestGet, requestPatch} from '#apis/index.ts';
import {UserInfoProps} from '#types/user.ts';

export const requestGetUserInfo = async (): Promise<UserInfoProps> => {
  // 유저 정보
  const url = '/user/info';
  return requestGet(url);
};

export const requestPatchUpdatePassword = async (payload: {
  password: string;
}): Promise<UserInfoProps> => {
  // 유저 비밀번호 수정
  const url = '/user/update/password';
  return requestPatch(url, payload);
};

export const requestPatchUpdatePush = async (payload: {
  settingPushApp: boolean;
}): Promise<UserInfoProps> => {
  // 푸시 알림 설정 수정
  const url = '/user/update/push';
  return requestPatch(url, payload);
};
