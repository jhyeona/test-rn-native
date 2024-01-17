import {instanceWithoutToken} from './instance.ts';

export const requestPostSignUpPhone = async (phone: string) => {
  // 아이디 (휴대폰) 중복 여부 체크
  const url = `/user/signup/phone/${phone}`;
  return instanceWithoutToken.get(url);
};

export const requestPostSignUpTAS = async (data: {}) => {
  // 본인 확인용 TAS 요청
  const url = '/user/signup/tas/request';
  return instanceWithoutToken.post(url, data);
};

export const requestPostSignUpSMSCode = async (data: {}) => {
  // 회원가입 시 SMS 코드 요청
  const url = '/user/signup/sms/request';
  return instanceWithoutToken.post(url, data);
};

export const requestPostSignUpSMSConfirm = async (data: {}) => {
  // 회원가입 시 SMS 코드 확인
  const url = '/user/signup/sms/confirm';
  return instanceWithoutToken.post(url, data);
};

export const requestPostSignUp = async (data: {}) => {
  // 최종 회원가입
  const url = '/user/signup';
  return instanceWithoutToken.post(url, data);
};
