import {
  requestDelete,
  requestGet,
  requestPatch,
  requestPost,
} from '#apis/index.ts';
import {
  InvitedAcademyListProps,
  JoinAcademyProps,
  UserInfoProps,
} from '#types/user.ts';

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

export const requestGetInvitedAcademyList =
  async (): Promise<InvitedAcademyListProps> => {
    // 기관 초대 리스트
    const url = `/academy/invite/list`;
    return requestGet(url);
  };

export const requestPostJoinAcademy = async (payload: {
  inviteIdList: Array<string>;
}): Promise<JoinAcademyProps> => {
  // 기관 초대 수락
  const url = `/academy/invite/join`;
  return requestPost(url, payload);
};

export const requestDeleteUser = async (payload: {
  password: string;
}): Promise<UserInfoProps> => {
  // 회원탈퇴
  const url = `/user/delete`;
  return requestDelete(url, {data: payload});
};
