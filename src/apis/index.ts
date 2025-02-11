import {AxiosRequestConfig} from 'axios';

import instance from '#apis/instance.ts';
import {ApiResponseErrorProps} from '#types/common.ts';

export const requestGet = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return instance
    .get(url, config)
    .then(async axiosResponse => {
      // const response: AxiosResponse<CommonResponseProps<T> = axiosResponse;
      const responseCode = axiosResponse.data.code;
      if (responseCode === '0000') {
        return axiosResponse.data?.data ?? axiosResponse.data;
      }
      throw axiosResponse.data;
    })
    .catch((error: ApiResponseErrorProps) => {
      throw error;
    });
};

export const requestPut = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return instance
    .put(url, data, config)
    .then(async axiosResponse => {
      // const response: AxiosResponse<CommonResponseProps<T> = axiosResponse;
      const responseCode = axiosResponse.data.code;
      if (responseCode === '0000') {
        return axiosResponse.data?.data ?? axiosResponse.data;
      }
      throw axiosResponse.data;
    })
    .catch((error: ApiResponseErrorProps) => {
      throw error;
    });
};

export const requestPost = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return instance
    .post(url, data, config)
    .then(async axiosResponse => {
      // const response: AxiosResponse<CommonResponseProps<T> = axiosResponse;
      const responseCode = axiosResponse?.data?.code ?? axiosResponse;
      if (responseCode === '0000') {
        return axiosResponse.data?.data ?? axiosResponse.data;
      }
      throw axiosResponse.data;
    })
    .catch((error: ApiResponseErrorProps) => {
      throw error;
    });
};

export const requestPatch = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return instance
    .patch(url, data, config)
    .then(async axiosResponse => {
      // const response: AxiosResponse<CommonResponseProps<T> = axiosResponse;
      const responseCode = axiosResponse.data.code;
      if (responseCode === '0000') {
        return axiosResponse.data?.data ?? axiosResponse.data;
      }
      throw axiosResponse.data;
    })
    .catch((error: ApiResponseErrorProps) => {
      throw error;
    });
};

export const requestDelete = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return instance
    .delete(url, config)
    .then(async axiosResponse => {
      // const response: AxiosResponse<CommonResponseProps<T> = axiosResponse;
      const responseCode = axiosResponse.data.code;
      if (responseCode === '0000') {
        return axiosResponse.data?.data ?? axiosResponse.data;
      }
      throw axiosResponse.data;
    })
    .catch((error: ApiResponseErrorProps) => {
      throw error;
    });
};
