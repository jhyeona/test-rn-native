import {Platform} from 'react-native';
import Config from 'react-native-config';

import axios, {AxiosResponse, InternalAxiosRequestConfig} from 'axios';

import {tokenRefresh} from '#apis/common.ts';
import {ACCESS_TOKEN, APP_VERSION, TOKEN_ERROR} from '#constants/common.ts';
import {checkLocationPermissions, checkPhonePermissions} from '#permissions/index.ts';
import {getDeviceUUID} from '#utils/common.ts';
import {onesignalLogout} from '#utils/onesignalHelper.ts';
import {clearStorage, getStorageItem, setStorageItem} from '#utils/storageHelper.ts';

// 공통 인스턴스 설정
const commonInstance = {
  baseURL: Config.BASE_URL,
  // baseURL: Config.BASE_URL_IP,
  timeout: 1000 * 30, // 30초
  maxRedirects: 3,
};

// 공통 헤더 설정
const setCommonHeaders = async (config: InternalAxiosRequestConfig) => {
  config.headers['stickyme-uuid'] = await getDeviceUUID();
  config.headers['stickyme-version'] = APP_VERSION;
  config.headers['stickyme-os'] = `${Platform.OS} ${Platform.Version}`;
  config.headers['stickyme-location-permit'] = await checkLocationPermissions();
  config.headers['stickyme-phone-permit'] = await checkPhonePermissions();
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
const instance = axios.create({...commonInstance});

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
    const errorCode = error.response.data.code;
    if (errorCode === '4102') {
      // 토큰 유효기간 만료
      originalRequest._retry = true;

      const isRefreshSuccessful = await tokenRefresh();
      if (isRefreshSuccessful) {
        return instance(originalRequest);
      }
    }
    if (errorCode === '4103' || errorCode === '4022') {
      // 유효하지 않은 토큰
      setStorageItem(ACCESS_TOKEN, TOKEN_ERROR);
      clearStorage();
      onesignalLogout();
    }

    if (axios.isAxiosError<any>(error)) {
      return Promise.reject(error?.response?.data);
    }
    return Promise.reject(error);
  },
);

export default instance;
