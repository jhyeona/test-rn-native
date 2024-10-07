import {Alert} from 'react-native';

import {instanceWithoutToken} from '#apis/instance.ts';
import {ACCESS_TOKEN, REFRESH_TOKEN, TOKEN_ERROR} from '#constants/common.ts';
import {setItem, storage} from '#utils/storageHelper.ts';

export const useTokenRefresh = async () => {
  // token refresh
  const url = '/token/refresh';
  const refreshToken = storage.getString(REFRESH_TOKEN);
  const header = {Authorization: `Bearer Token ${refreshToken}`};

  try {
    const response = await instanceWithoutToken.post(url, null, {
      headers: header,
    });
    const {access_token, refresh_token} = response.data.data;
    setItem(ACCESS_TOKEN, access_token);
    setItem(REFRESH_TOKEN, refresh_token);
    return true;
  } catch (error) {
    // if (axios.isAxiosError<ApiResponseProps<null>, any>(error)) {
    //   if (error?.response?.data.code === '4102') {
    //     Alert.alert('세션이 만료되었습니다.\n다시 로그인해주세요.');
    //   }
    // }
    console.log('* use token refresh ERROR', error);
    setItem(ACCESS_TOKEN, TOKEN_ERROR);
    setItem(REFRESH_TOKEN, TOKEN_ERROR);
    return false;
  }
};
