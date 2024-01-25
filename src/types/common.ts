import {ViewStyle} from 'react-native';

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
  data: CommonResponseProps<T>;
  message: string;
  statusCode: number;
}
