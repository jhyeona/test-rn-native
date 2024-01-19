import {storage} from '../utils/storageHelper.ts';
import axios from 'axios';
import {ApiResponse} from '../types/common.ts';
import {instanceWithoutToken} from './instance.ts';
import {Alert} from 'react-native';

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
    if (axios.isAxiosError<ApiResponse, any>(error)) {
      // console.log('AXIOS Error:', error?.response?.data);
      // console.log('CODE', error?.response?.data.code);
      if (error?.response?.data.code === '4102') {
        Alert.alert('토큰 만료');
        storage.delete('access_token');
        storage.delete('refresh_token');
      }
    }
    return false;
  }
};
