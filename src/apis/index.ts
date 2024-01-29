import {AxiosRequestConfig, AxiosResponse} from 'axios';
import instance from './instance.ts';
import {ApiResponseProps} from '../types/common.ts';

export const requestGet = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResponseProps<T>> => {
  return instance.get(url, config);
};

export const requestPut = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResponseProps<T>> => {
  return instance.put(url, data, config);
};

export const requestPost = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResponseProps<T>> => {
  return instance.post(url, data, config);
};

export const requestPatch = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResponseProps<T>> => {
  return instance.patch(url, data, config);
};

export const requestDelete = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResponseProps<T>> => {
  return instance.delete(url, config);
};
