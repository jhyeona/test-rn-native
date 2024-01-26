import moment from 'moment';

export const checkPhone = (phone: string) => {
  // '-' 입력 시
  // const regExp = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/
  const regExp = /^01(?:0|1|[6-9])(?:\d{3}|\d{3,4})\d{4}$/;
  return regExp.test(phone);
};

export const checkPassword = (password: string) => {
  const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,30}$/;
  return regExp.test(password);
};

export const checkName = (name: string) => {
  const regExp = /^[가-힣]{2,4}$/;
  return regExp.test(name);
};

export const checkDate = (date: string) => {
  const regExp =
    /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;

  return regExp.test(date);
};
