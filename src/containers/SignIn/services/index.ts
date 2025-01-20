import {instanceWithoutToken} from '#apis/instance.ts';
import {GetAccessTokenProps, ReqSignIn} from '#types/user.ts';

export const requestPostGetToken = async (payload: ReqSignIn): Promise<GetAccessTokenProps> => {
  // 로그인
  const url = `/token/authenticate${payload.isRevive ? '?revive=true' : ''}`;

  return instanceWithoutToken.post(url, payload);
};
