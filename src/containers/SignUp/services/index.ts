import {instanceWithoutToken} from '#apis/instance.ts';
import {ReqSignUpTAS, ReqSmsConfirm, ReqSignUp, ResSmsConfirmProps} from '#types/user.ts';

export const requestPostSignUpPhone = async (phone: string): Promise<any> => {
  // 아이디 (휴대폰) 중복 여부 체크
  const url = `/user/signup/phone/${phone}`;
  return instanceWithoutToken.get(url);
};

export const requestPostSignUpTAS = async (payload: ReqSignUpTAS): Promise<any> => {
  // 본인 확인용 TAS 요청
  const url = '/user/signup/tas/request';
  return instanceWithoutToken.post(url, payload);
};

export const requestPostSignUpSMSConfirm = async (
  payload: ReqSmsConfirm,
): Promise<ResSmsConfirmProps> => {
  // 회원가입 시 SMS 전송 여부 확인
  const url = '/user/signup/phone/verify';
  return instanceWithoutToken.post(url, payload);
};

export const requestPostSignUp = async (payload: ReqSignUp): Promise<any> => {
  // 최종 회원가입
  const url = '/user/signup/by-code';
  return instanceWithoutToken.post(url, payload);
};
