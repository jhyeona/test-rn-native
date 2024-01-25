import {
  requestPostSignUp,
  requestPostSignUpPhone,
  requestPostSignUpSMSCode,
  requestPostSignUpSMSConfirm,
  requestPostSignUpTAS,
} from '../apis/signUp.ts';

export const postSignUpPhone = async (phone: string) => {
  const response = await requestPostSignUpPhone(phone);
  return response.data;
};

export const postSignUpTAS = async (data: {}) => {
  const response = await requestPostSignUpTAS(data);
  return response.data;
};

export const postSignUpSMS = async (data: {}) => {
  const response = await requestPostSignUpSMSCode(data);
  return response.data;
};

export const postSignUpSMSConfirm = async (data: {}) => {
  const response = await requestPostSignUpSMSConfirm(data);
  return response.data;
};

export const postSignUp = async (data: {}) => {
  const response = await requestPostSignUp(data);
  return response.data;
};
