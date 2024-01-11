import {AxiosRequestConfig} from 'axios';
import instance from '../apis/instance.ts';

export const requestGet = async (url: string, config?: AxiosRequestConfig) => {
  return instance.post(url, config);
};

export const requestPut = async (
  url: string,
  data?: {},
  config?: AxiosRequestConfig,
) => {
  return instance.post(url, data, config);
};

export const requestPost = async (
  url: string,
  data?: {},
  config?: AxiosRequestConfig,
) => {
  return instance.post(url, data, config);
};

export const requestDelete = async (
  url: string,
  config?: AxiosRequestConfig,
) => {
  return instance.post(url, config);
};
