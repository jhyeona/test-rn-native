import {ViewStyle} from 'react-native';

export interface ApiResponse {
  txid: string;
  code: string;
  message: string;
  description: string;
  timestamp: number;
  data?: null;
}

export interface checkboxProps {
  isChecked: boolean;
  disabled?: boolean;
  onValueChangeHandler: (checked: boolean) => void;
  labelMessage?: string;
  style?: ViewStyle;
}
