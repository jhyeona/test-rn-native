import axios from 'axios';
import {storage} from '../utils/storageHelper.ts';
import {tokenRefresh} from './common.ts';
import {useSetRecoilState} from 'recoil';
import globalState from '../recoil/Global';
import {Alert} from 'react-native';

// TODO: 환경변수로?
const baseURL = 'http://192.168.219.184:8081/api/v3';

export const instanceWithoutToken = axios.create({
  baseURL: baseURL,
});

const instance = axios.create({
  baseURL: baseURL,
});

instance.interceptors.request.use(
  function (config) {
    // 요청이 전달되기 전에 작업 수행 -> token 확인
    const accessToken = storage.getString('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);
// 응답 인터셉터
instance.interceptors.response.use(
  function (response) {
    // 응답 데이터가 있는 작업 수행
    return response;
  },
  async function (error) {
    // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 오류가 있는 작업 수행
    const originalRequest = error.config;
    if (
      error.response.data.code === '4102' //&& // 토큰 만료 status code 401 / response code 4102
      // !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const isRefreshSuccessful = await tokenRefresh();
      if (isRefreshSuccessful) {
        return instance(originalRequest);
      }
    }
    if (error.response.data.code === '4103') {
      // 유효하지 않은 토큰
      Alert.alert('토큰 X');
      storage.delete('access_token');
      storage.delete('refresh_token');
    }

    if (axios.isAxiosError<any>(error)) {
      return Promise.reject(error?.response?.data);
    }
    return Promise.reject(error);
  },
);

export default instance;
