import {requestPatch} from '#apis/index.ts';
import {UserInfoProps} from '#types/user.ts';

export const requestPatchUpdatePersonal = (payload: {code: string}): Promise<UserInfoProps> => {
  const url = '/user/update/personal';
  return requestPatch(url, payload);
};
