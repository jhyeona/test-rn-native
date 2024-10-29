import {requestGet} from '#apis/index.ts';
import {instanceWithoutToken} from '#apis/instance.ts';
import {REFRESH_TOKEN} from '#constants/common.ts';
import {AcademyProps, ResRefreshToken, UserInfoProps} from '#types/user.ts';
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

// UUID 초기화 필요 기관 확인
export const requestGetCheckUuid = async (uuid?: string): Promise<AcademyProps[]> => {
  const url = '/user/check-uuid';
  const config = {headers: {checkhere_uuid: uuid ?? ''}};
  return requestGet(url, config);
};
