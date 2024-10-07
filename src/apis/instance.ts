import Config from 'react-native-config';

import axios, {AxiosResponse} from 'axios';

import {useTokenRefresh} from '#apis/common.ts';
import {ACCESS_TOKEN, REFRESH_TOKEN} from '#constants/common.ts';
import {storage} from '#utils/storageHelper.ts';

// 토큰 미사용 인스턴스
export const instanceWithoutToken = axios.create({
  baseURL: Config.BASE_URL,
});

instanceWithoutToken.interceptors.response.use(
  function (response: AxiosResponse) {
    const responseCode = response.data.code;
    if (responseCode === '0000') {
      return response.data?.data ?? response.data;
    }
    return response;
  },
  async function (error): Promise<AxiosResponse> {
    if (axios.isAxiosError<any>(error)) {
      return Promise.reject(error?.response?.data);
    }
    return Promise.reject(error);
  },
);

// 토큰 사용 인스턴스
const instance = axios.create({
  baseURL: Config.BASE_URL,
});

instance.interceptors.request.use(
  function (config) {
    // 요청이 전달되기 전에 작업 수행 -> token 확인
    const accessToken = storage.getString(ACCESS_TOKEN);
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
  function (response: AxiosResponse) {
    // 응답 데이터가 있는 작업 수행
    return response;
  },
  async function (error): Promise<AxiosResponse> {
    // 응답 오류가 있는 작업 수행
    const originalRequest = error.config;
    if (
      error.response.data.code === '4102' //&& // 토큰 만료 status code 401 / response code 4102
    ) {
      originalRequest._retry = true;

      const isRefreshSuccessful = await useTokenRefresh();
      if (isRefreshSuccessful) {
        return instance(originalRequest);
      }
    }
    if (error.response.data.code === '4103') {
      // 유효하지 않은 토큰
      storage.delete(ACCESS_TOKEN);
      storage.delete(REFRESH_TOKEN);
      storage.clearAll();
    }

    if (axios.isAxiosError<any>(error)) {
      return Promise.reject(error?.response?.data);
    }
    return Promise.reject(error);
  },
);

export default instance;
