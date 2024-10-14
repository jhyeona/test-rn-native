import {requestGet, requestPost} from '#apis/index.ts';
import {
  InvitedAcademyListProps,
  ReqJoinAcademyProps,
  ResJoinAcademyProps,
} from '#types/user.ts';

export const requestGetInvitedAcademyList =
  async (): Promise<InvitedAcademyListProps> => {
    // 기관 초대 리스트
    const url = `/academy/invite/list`;
    return requestGet(url);
  };

export const requestPostJoinAcademy = async (
  payload: ReqJoinAcademyProps,
): Promise<ResJoinAcademyProps> => {
  // 기관 초대 수락
  const url = `/academy/invite/join`;
  return requestPost(url, payload);
};
