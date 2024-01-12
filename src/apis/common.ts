import {requestPost} from './index.ts';
import {storage} from '../utils/storageHelper.ts';

export const tokenRefresh = async () => {
  // token refresh
  const url = '/token/refresh';
  const refreshToken = storage.getString('refreshToken');
  const header = {Authorization: `bearer ${refreshToken}`};
  // return requestPost(url, {}, {headers: header});
  try {
    const response = await requestPost(url, {}, {headers: header});
    const {access_token, refresh_token} = response.data;
    storage.set('jwtToken', access_token);
    storage.set('refreshToken', refresh_token);
    return true;
  } catch (error) {
    console.log('[refreshTokenError]', error);
    return false;
  }
};
