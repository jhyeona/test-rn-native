import {requestPostSignUp} from '../apis/signUp.ts';

export const postSignUpPhone = async (args: {url: string; data: {}}) => {
  const response = await requestPostSignUp(args);
  return response.data;
};
