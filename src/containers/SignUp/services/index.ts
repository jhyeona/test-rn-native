import {requestPost} from '#apis/index.ts';
import {instanceWithoutToken} from '#apis/instance.ts';
import {ReqSignUpTAS, ReqSmsConfirm, ReqSignUp, ResSignUpTAS} from '#types/user.ts';

export const requestPostSignUpPhone = async (phone: string): Promise<any> => {
  // 아이디 (휴대폰) 중복 여부 체크
  const url = `/user/signup/phone/${phone}`;
  return instanceWithoutToken.get(url);
};

export const requestPostSignUpTAS = async (
  payload: ReqSignUpTAS,
  isChangePhone?: boolean,
): Promise<ResSignUpTAS> => {
  // 본인 확인용 TAS 요청, isChangePhone(휴대폰번호변경) 일 경우 토큰 사용 API 호출
  const url = `/user/${isChangePhone ? 'update' : 'signup'}/tas/request`;
  return isChangePhone ? requestPost(url, payload) : instanceWithoutToken.post(url, payload);
};

export const requestPostSignUpSMSConfirm = async (payload: ReqSmsConfirm): Promise<any> => {
  // 회원가입 시 SMS 전송 여부 확인
  const url = '/user/signup/phone/verify';
  return instanceWithoutToken.post(url, payload);
};

export const requestPostSignUp = async (payload: ReqSignUp): Promise<any> => {
  // 최종 회원가입
  const url = '/user/signup/by-code';
  return instanceWithoutToken.post(url, payload);
};
