import {requestPost} from '../utils/requestHelper.ts';

export const requestPostSignUp = async (args: {data: {}}) => {
  // 최종 회원가입
  const url = '/user/signup';
  const {data} = args;
  return requestPost(url, data);
};

export const requestPostSignUpPhone = async (args: {data: {}}) => {
  // 아이디 (휴대폰) 중복 여부 체크
  const url = '/user/signup/phone';
  const {data} = args;
  return requestPost(url, data);
};

export const requestPostSignUpTAS = async (args: {data: {}}) => {
  // 본인 확인용 TAS 요청
  const url = '/user/signup/tas/request';
  const {data} = args;
  return requestPost(url, data);
};

export const requestPostSignUpSMSCode = async (args: {data: {}}) => {
  // 회원가입 시 SMS 코드 요청
  const url = '/user/signup/sms/request';
  const {data} = args;
  return requestPost(url, data);
};

export const requestPostSignUpSMSConfirm = async (args: {data: {}}) => {
  // 회원가입 시 SMS 코드 확인
  const url = '/user/signup/sms/confirm';
  const {data} = args;
  return requestPost(url, data);
};
