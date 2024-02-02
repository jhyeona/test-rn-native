import {requestPostGetToken} from '../apis/signIn.ts';

export const postGetToken = async (payload: {
  phone: string;
  password: string;
}) => {
  const response = await requestPostGetToken(payload);
  return response.data?.data;
};
