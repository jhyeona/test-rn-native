import {requestPatchUserUpdate} from '../apis/user.ts';

export const patchUserUpdate = async (args: {data: {}}) => {
  const response = await requestPatchUserUpdate(args);
  return response.data;
};
