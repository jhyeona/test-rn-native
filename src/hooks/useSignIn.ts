import {requestPostGetToken} from '../apis/signIn.ts';

export const postGetToken = async (args: {data: {}}) => {
  const response = await requestPostGetToken(args);
  return response.data;
};
