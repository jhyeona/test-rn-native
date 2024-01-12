import axios from 'axios';
import {storage} from '../utils/storageHelper.ts';
import {tokenRefresh} from './common.ts';

// TODO: 환경변수로?
const baseURL = 'http://192.168.219.184:8081/api/v3';

//axios#get(url[, config])
//axios#post(url[, data[, config]])
//axios#put(url[, data[, config]])
//axios#delete(url[, config])

const instance = axios.create({
  baseURL: baseURL,
});

instance.interceptors.request.use(
  function (config) {
    // 요청이 전달되기 전에 작업 수행 -> token 확인
    const accessToken = storage.getString('jwtToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    // 요청 오류가 있는 작업 수행
    return Promise.reject(error);
  },
);

// 응답 인터셉터 추가하기
instance.interceptors.response.use(
  function (response) {
    // 2xx 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 데이터가 있는 작업 수행
    return response;
  },
  async function (error) {
    // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 오류가 있는 작업 수행
    // const originalRequest = error.config;
    // // Handle token expiration and retry the request with a refreshed token
    // if (
    //   error.response &&
    //   error.response.status === 401 && // status code 401 / response code 4102
    //   !originalRequest._retry
    // ) {
    //   originalRequest._retry = true;
    //   const isRefreshSuccessful = await tokenRefresh();
    //   if (isRefreshSuccessful) {
    //     return instance(originalRequest);
    //   }
    // }
    return Promise.reject(error);
  },
);

export default instance;
