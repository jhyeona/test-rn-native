import {instanceWithoutToken} from '#apis/instance.ts';
import {ApiResponseProps} from '#types/common.ts';
import {SmsConfirmProps} from '#types/user.ts';

export const requestPostSignUpPhone = async (
  phone: string,
): Promise<ApiResponseProps<any>> => {
  // 아이디 (휴대폰) 중복 여부 체크
  const url = `/user/signup/phone/${phone}`;
  return instanceWithoutToken.get(url);
};

export const requestPostSignUpTAS = async (payload: {}): Promise<
  ApiResponseProps<any>
> => {
  // 본인 확인용 TAS 요청
  const url = '/user/signup/tas/request';
  return instanceWithoutToken.post(url, payload);
};

export const requestPostSignUpSMSCode = async (payload: {}): Promise<
  ApiResponseProps<SmsConfirmProps>
> => {
  // 회원가입 시 SMS 코드 요청
  const url = '/user/signup/sms/request';
  return instanceWithoutToken.post(url, payload);
};

export const requestPostSignUpSMSConfirm = async (payload: {}): Promise<
  ApiResponseProps<SmsConfirmProps>
> => {
  // 회원가입 시 SMS 코드 확인
  const url = '/user/signup/sms/confirm';
  return instanceWithoutToken.post(url, payload);
};

export const requestPostSignUp = async (payload: {}): Promise<
  ApiResponseProps<any>
> => {
  // 최종 회원가입
  const url = '/user/signup';
  return instanceWithoutToken.post(url, payload);
};
