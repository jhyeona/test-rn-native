import SignUpUserData from '#containers/SignUp/components/SignUpUserData.tsx';
import SignUpUserPassword from '#containers/SignUp/components/SignUpUserPassword.tsx';
import SignUpUserPhone from '#containers/SignUp/components/SignUpUserPhone.tsx';
import {PageData, SignUpDataProps} from '#types/signup.ts';

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

const componentMap = {
  SignUpUserData,
  SignUpUserPhone,
  SignUpUserPassword,
};

export const renderItem = ({item}: {item: PageData}) => {
  const Component = componentMap[item.id];
  return Component ? <Component {...item.props} /> : null;
};
