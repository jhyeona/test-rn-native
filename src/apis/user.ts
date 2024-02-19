import {requestGet, requestPatch, requestPost} from './index.ts';
import {instanceWithoutToken} from './instance.ts';
import {ApiResponseProps} from '../types/common.ts';
import {
  InvitedAcademyListProps,
  JoinAcademyProps,
  UserInfoProps,
} from '../types/user.ts';

export const requestPostFindPassword = async (payload: {
  phone: string;
  name: string;
  birth: string;
}): Promise<ApiResponseProps<null>> => {
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

export const requestPatchUpdatePassword = async (payload: {
  password: string;
}): Promise<ApiResponseProps<UserInfoProps>> => {
  // 유저 비밀번호 수정
  const url = '/user/update/password';
  return requestPatch(url, payload);
};

export const requestPatchUpdatePush = async (payload: {
  settingPushApp: boolean;
}): Promise<ApiResponseProps<UserInfoProps>> => {
  // 푸시 알림 설정 수정
  const url = '/user/update/push';
  return requestPatch(url, payload);
};

export const requestGetInvitedAcademyList = async (): Promise<
  ApiResponseProps<InvitedAcademyListProps>
> => {
  const url = `/academy/invite/list`;
  return requestGet(url);
};

export const requestPostJoinAcademy = async (payload: {
  inviteIdList: Array<number>;
}): Promise<ApiResponseProps<JoinAcademyProps>> => {
  const url = `/academy/invite/join`;
  return requestPost(url, payload);
};
