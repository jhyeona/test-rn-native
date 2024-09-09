import {instanceWithoutToken} from '#apis/instance.ts';
import {GetAccessTokenProps} from '#types/user.ts';

export const requestPostGetToken = async (payload: {
  phone: string;
  password: string;
}): Promise<GetAccessTokenProps> => {
  // 로그인
  const url = '/token/authenticate';

  return instanceWithoutToken.post(url, payload);
};
