import {requestPatchUserUpdate} from '../apis/user.ts';

export const patchUserUpdate = async (payload: {}) => {
  const response = await requestPatchUserUpdate(payload);
  return response.data;
};
