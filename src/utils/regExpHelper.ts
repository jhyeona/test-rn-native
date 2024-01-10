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
