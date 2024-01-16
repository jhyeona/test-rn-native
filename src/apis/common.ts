import {storage} from '../utils/storageHelper.ts';
import axios from 'axios';
import {apiResponse} from '../types/common.ts';
import {instanceWithoutToken} from './instance.ts';

export const tokenRefresh = async () => {
  // token refresh
  const url = '/token/refresh';
  const refreshToken = storage.getString('refresh_token');
  const header = {Authorization: `Bearer ${refreshToken}`};

  try {
    const response = await instanceWithoutToken.post(
      url,
      {},
      {
        headers: header,
      },
    );
    const {access_token, refresh_token} = response.data.data;
    storage.set('access_token', access_token);
    storage.set('refresh_token', refresh_token);
    return true;
  } catch (error) {
    if (axios.isAxiosError<apiResponse, any>(error)) {
      // console.log('AXIOS Error:', error?.response?.data);
      // console.log('CODE', error?.response?.data.code);
      if (error?.response?.data.code === '4102') {
        storage.delete('access_token');
        storage.delete('refresh_token');
      }
    }
    return false;
  }
};
