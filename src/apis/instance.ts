import {Platform} from 'react-native';
import Config from 'react-native-config';

import axios, {AxiosResponse, InternalAxiosRequestConfig} from 'axios';

import {tokenRefresh} from '#apis/common.ts';
import {ACCESS_TOKEN, APP_VERSION, TOKEN_ERROR} from '#constants/common.ts';
import {getDeviceUUID} from '#utils/common.ts';
import {clearStorage, getStorageItem, setStorageItem} from '#utils/storageHelper.ts';

// 공통 인스턴스 설정
const commonInstance = {
  baseURL: Config.BASE_URL,
  timeout: 1000 * 180, // 3분
  maxRedirects: 3,
};

// 공통 헤더 설정
const setCommonHeaders = async (config: InternalAxiosRequestConfig) => {
  config.headers.checkhere_uuid = await getDeviceUUID();
  config.headers.checkhere_version = APP_VERSION;
  config.headers.checkhere_os = `${Platform.OS} ${Platform.Version}`;
  return config;
};

// 토큰 미사용 인스턴스
export const instanceWithoutToken = axios.create({...commonInstance});
instanceWithoutToken.interceptors.request.use(
  async function (config) {
    try {
      await setCommonHeaders(config);
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  function (error) {
    return Promise.reject(error);
  },
);

instanceWithoutToken.interceptors.response.use(
  function (response: AxiosResponse) {
    return response.data?.data ?? response.data;
  },
  async function (error): Promise<AxiosResponse> {
    if (axios.isAxiosError<any>(error)) {
      return Promise.reject(error?.response?.data);
    }
    return Promise.reject(error);
  },
);

// 토큰 사용 인스턴스
const instance = axios.create(commonInstance);

instance.interceptors.request.use(
  async function (config) {
    try {
      const accessToken = getStorageItem(ACCESS_TOKEN);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      await setCommonHeaders(config);
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
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

      const isRefreshSuccessful = await tokenRefresh();
      if (isRefreshSuccessful) {
        return instance(originalRequest);
      }
    }
    if (error.response.data.code === '4103') {
      // 유효하지 않은 토큰
      setStorageItem(ACCESS_TOKEN, TOKEN_ERROR);
      clearStorage();
    }

    if (axios.isAxiosError<any>(error)) {
      return Promise.reject(error?.response?.data);
    }
    return Promise.reject(error);
  },
);

export default instance;
