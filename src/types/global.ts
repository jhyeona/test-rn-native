import {ReactNode} from 'react';

export interface GlobalModalProps {
  isVisible: boolean;
  title: string;
  message?: string;
  children?: ReactNode;
  isConfirm?: boolean;
  hideButtons?: boolean;
  onPressConfirm?: () => void;
  onPressCancel?: () => void;
}
