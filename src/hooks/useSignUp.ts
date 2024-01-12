import {
  requestPostSignUp,
  requestPostSignUpPhone,
  requestPostSignUpSMSCode,
  requestPostSignUpSMSConfirm,
  requestPostSignUpTAS,
} from '../apis/signUp.ts';

export const postSignUpPhone = async (args: {data: {}}) => {
  const response = await requestPostSignUpPhone(args);
  return response.data;
};

export const postSignUpTAS = async (args: {data: {}}) => {
  const response = await requestPostSignUpTAS(args);
  return response.data;
};

export const postSignUpSMS = async (args: {data: {}}) => {
  const response = await requestPostSignUpSMSCode(args);
  return response.data;
};

export const postSignUpSMSConfirm = async (args: {data: {}}) => {
  const response = await requestPostSignUpSMSConfirm(args);
  return response.data;
};

export const postSignUp = async (args: {data: {}}) => {
  const response = await requestPostSignUp(args);
  return response.data;
};
