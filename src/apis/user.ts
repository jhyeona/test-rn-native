import {requestGet} from '#apis/index.ts';
import {instanceWithoutToken} from '#apis/instance.ts';
import {REFRESH_TOKEN} from '#constants/common.ts';
import {ResRefreshToken, UserInfoProps} from '#types/user.ts';
import {getStorageItem} from '#utils/storageHelper.ts';

// 유저 정보
export const requestGetUserInfo = async (): Promise<UserInfoProps> => {
  const url = '/user/info';
  return requestGet(url);
};

// 토큰 리프레시
export const requestPostRefreshToken = async (): Promise<ResRefreshToken> => {
  const url = '/token/refresh';
  const refreshToken = getStorageItem(REFRESH_TOKEN);
  const header = {Authorization: `Bearer ${refreshToken}`};
  return instanceWithoutToken.post(url, null, {
    headers: header,
  });
};
