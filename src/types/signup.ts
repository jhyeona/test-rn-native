export interface SignUpDataProps {
  name: string;
  birthday: string;
  gender: string;
  phone: string;
  telecom: string;
  smsCode: string;
  password: string;
  rePassword: string;
  code?: string;
}

export interface PageData {
  index: number;
  id: 'SignUpUserData' | 'SignUpUserPhone' | 'SignUpUserPassword';
  props?: any;
}
