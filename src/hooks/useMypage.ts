import {
  requestPatchUpdatePassword,
  requestPatchUpdatePush,
} from '#apis/user.ts';

export const patchUpdatePassword = async (payload: {password: string}) => {
  const response = await requestPatchUpdatePassword(payload);
  return response.data;
};

export const patchUpdatePush = async (payload: {settingPushApp: boolean}) => {
  const response = await requestPatchUpdatePush(payload);
  return response.data;
};
