import {requestPost} from '../utils/requestHelper.ts';

export const requestPostSignUp = async (args: {url: string; data: {}}) => {
  const {url, data} = args;
  return requestPost(url, data);
};
