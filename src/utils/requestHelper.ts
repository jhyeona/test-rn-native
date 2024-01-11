import {AxiosRequestConfig} from 'axios';
import instance from '../apis/instance.ts';

export const requestPost = async (
  url: string,
  data?: {},
  config?: AxiosRequestConfig,
) => {
  return instance.post(url, data, config);
};
