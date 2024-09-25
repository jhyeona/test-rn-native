import {Alert} from 'react-native';

import {instanceWithoutToken} from '#apis/instance.ts';
import {setItem, storage} from '#utils/storageHelper.ts';

export const tokenRefresh = async () => {
  // token refresh
  const url = '/token/refresh';
  const refreshToken = storage.getString('refresh_token');
  const header = {Authorization: `Bearer Token ${refreshToken}`};
  try {
    const response = await instanceWithoutToken.post(url, null, {
      headers: header,
    });
    const {access_token, refresh_token} = response.data.data;
    setItem('access_token', access_token);
    setItem('refresh_token', refresh_token);
    return true;
  } catch (error) {
    // if (axios.isAxiosError<ApiResponseProps<null>, any>(error)) {
    //   if (error?.response?.data.code === '4102') {
    //     Alert.alert('세션이 만료되었습니다.\n다시 로그인해주세요.');
    //   }
    // }
    Alert.alert('세션이 만료되었습니다.\n다시 로그인해주세요.');
    storage.delete('access_token');
    storage.delete('refresh_token');
    storage.clearAll();
    return false;
  }
};
