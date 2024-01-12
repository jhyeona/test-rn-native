import {requestPostGetToken} from '../apis/SignIn.ts';

export const postGetToken = async (args: {url: string; data: {}}) => {
  const response = await requestPostGetToken(args);
  return response.data;
};
