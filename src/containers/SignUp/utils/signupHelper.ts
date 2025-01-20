import {SignUpDataProps} from '#containers/SignUp';

export const getInitialSignUpData = (): SignUpDataProps => ({
  name: '',
  birthday: '',
  phone: '',
  gender: '',
  telecom: '',
  smsCode: '',
  password: '',
  rePassword: '',
});
