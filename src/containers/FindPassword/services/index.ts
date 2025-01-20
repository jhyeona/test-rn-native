import {instanceWithoutToken} from '#apis/instance.ts';
import {UserDefaultProps} from '#types/user.ts';

export const reqFindPassword = async (payload: UserDefaultProps): Promise<any> => {
  // 비밀번호 찾기
  const url = '/user/forgot';
  return instanceWithoutToken.post(url, payload);
};
