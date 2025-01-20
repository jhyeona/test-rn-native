import {QueryObserverResult, RefetchOptions} from '@tanstack/react-query';

export interface CommonResponseProps<T> {
  txid: string;
  code: string;
  message: string;
  description: string;
  timestamp: number;
  data?: T;
}

export interface ApiResponseProps<T> {
  code: string;
  data?: CommonResponseProps<T>;
  message: string;
  statusCode: number;
}

export interface ApiResponseErrorProps {
  code: string;
  description: string;
  message: string;
  timestamp: number;
  txid: string;
}

export interface RefetchProps<T> {
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<T, Error>>;
}
