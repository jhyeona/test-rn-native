import {requestPostRefreshToken} from '#apis/user.ts';
import {ACCESS_TOKEN, REFRESH_TOKEN, TOKEN_ERROR} from '#constants/common.ts';
import {setStorageItem} from '#utils/storageHelper.ts';

export const tokenRefresh = async () => {
  try {
    const {access_token, refresh_token, expires_in} =
      await requestPostRefreshToken();
    console.log('TOKEN REFRESH(expires):', expires_in);
    setStorageItem(ACCESS_TOKEN, access_token);
    setStorageItem(REFRESH_TOKEN, refresh_token);
    return true;
  } catch (error) {
    // if (axios.isAxiosError<ApiResponseProps<null>, any>(error)) {
    //   if (error?.response?.data.code === '4102') {
    //     Alert.alert('세션이 만료되었습니다.\n다시 로그인해주세요.');
    //   }
    // }
    console.log('* use token refresh ERROR', error);
    setStorageItem(ACCESS_TOKEN, TOKEN_ERROR);
    setStorageItem(REFRESH_TOKEN, TOKEN_ERROR);
    return false;
  }
};
